import { Body, Controller, Get, Param, Post, Query, Render, Res } from '@nestjs/common';
import { Public } from '../auth/guards/public.decorator';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
export class AdminController {
}
