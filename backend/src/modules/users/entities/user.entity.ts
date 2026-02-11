import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Answer } from '../../answers/entities/answer.entity';
import { Role } from '../../auth/guards/roles/roles.decorator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;
  
  @Column({ unique: true })
  display_name: string;

  @Column()
  password: string; // This will be the hashed password

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Answer, answer => answer.user, { cascade: true })
  answers: Answer[];
}