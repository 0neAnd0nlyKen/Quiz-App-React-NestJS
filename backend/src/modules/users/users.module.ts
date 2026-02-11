import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { AnswersModule } from '../answers/answers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AnswersModule
  ], // Registers the entity
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController], // Exported so AuthModule can inject it
})
export class UsersModule {}