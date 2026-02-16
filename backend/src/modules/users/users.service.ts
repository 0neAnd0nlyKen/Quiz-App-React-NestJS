import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../auth/guards/roles/roles.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string | undefined): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>, userRole?: Role): Promise<User> {
    const existing = await this.findOneByEmail(userData.email);
    
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }
    
    userData.role = userRole === Role.Admin ? Role.User : userData.role || Role.User;

    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // Helper for Admin panel later
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findByQuery(query: string): Promise<User[]> {
    if (!query || query.trim() === '') {
      return this.findAll();
    }
    // use like operator for partial matches, and search both email and username
    return this.usersRepository.createQueryBuilder('user')
      .where('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('user.username ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateData: Partial<User>): Promise<User> {
    if (updateData.password && updateData.password.trim() !== '') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }    
    await this.usersRepository.update(id, updateData);
    return this.findOne(id) as Promise<User>;
  }
  
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

}