import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Email ou mot de passe incorrect');
    return user;
  }

  signTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'fidelilink-secret-dev',
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'fidelilink-refresh-dev',
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        universalPoints: user.universalPoints,
        loyaltyLevel: user.loyaltyLevel,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return this.signTokens(user);
  }

  async register(email: string, password: string, firstName: string, lastName: string, role = 'client') {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Cet email est déjà utilisé');
    const user = await this.usersService.create(email, password, role, firstName, lastName);
    return this.signTokens(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'fidelilink-refresh-dev',
      });
      const user = await this.usersService.findById(payload.sub);
      return this.signTokens(user);
    } catch {
      throw new UnauthorizedException('Token invalide');
    }
  }
}