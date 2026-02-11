import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from '../guards/roles/roles.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  display_name: string;
  
  //role column
  @IsString()
  role?: Role;
}