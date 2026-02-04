import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Registers the entity
  providers: [UsersService],
  exports: [UsersService], // Exported so AuthModule can inject it
})
export class UsersModule {}