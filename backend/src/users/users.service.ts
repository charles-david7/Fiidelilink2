import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string, role = 'client', firstName?: string, lastName?: string) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = this.repo.create({ email, passwordHash, role: role as UserRole, firstName, lastName });
    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }

  async findById(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async updateUniversalPoints(userId: string, delta: number) {
    await this.repo.increment({ id: userId }, 'universalPoints', delta);
    // Update loyalty level
    const user = await this.findById(userId);
    let level = 'bronze';
    if (user.universalPoints >= 500) level = 'or';
    else if (user.universalPoints >= 200) level = 'argent';
    await this.repo.update(userId, { loyaltyLevel: level });
  }

  async getProfile(id: string) {
    return this.findById(id);
  }

  async updateProfile(id: string, dto: { firstName?: string; lastName?: string }) {
    await this.repo.update(id, dto);
    return this.findById(id);
  }

  async deleteAccount(id: string) {
    await this.repo.delete(id);
    return { message: 'Compte supprimé' };
  }
}