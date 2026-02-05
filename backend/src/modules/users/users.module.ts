import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ], // Registers the entity
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController], // Exported so AuthModule can inject it
})
export class UsersModule {}