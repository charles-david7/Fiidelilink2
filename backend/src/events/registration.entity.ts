import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('registrations')
@Unique(['userId', 'eventId'])
export class Registration {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() eventId: string;
  @Column({ default: 'registered' }) status: string;
  @Column({ nullable: true }) qrToken: string;
  @CreateDateColumn() createdAt: Date;
}