import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: Record<string, any>): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
}
