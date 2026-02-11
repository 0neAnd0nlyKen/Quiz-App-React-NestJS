import {
	Controller,
	Get,
	Post,
	Patch,
	Param,
	Body,
	Req,
	UsePipes,
	ValidationPipe,
	Delete,
	Put,
	Query,
	Logger,
} from '@nestjs/common';
import { UserQuizSessionsService } from './user-quiz-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SyncSessionDto } from './dto/sync-session.dto';
import { Roles, Role } from '../auth/guards/roles/roles.decorator';
import { BatchAnswersDto, CreateAnswerDto } from '../answers/dto/create-answer.dto';
import { sessionStatus } from './entities/user-quiz-session.entity';
import { JwtPayload } from '../auth/guards/jwt-auth/jwt.strategy';

@Controller('sessions')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserQuizSessionController {
	private readonly logger = new Logger(UserQuizSessionController.name);
	constructor(private service: UserQuizSessionsService) {}

	@Get()
	async findAll(@Req() req) {
		const user : JwtPayload = req.user;
		this.logger.log(`Finding active sessions for user ID: ${user}`);
		const userId = user.id; // id from JWT token
		this.logger.log(`Finding active sessions for user ID: ${userId}`);
		if (user.role === Role.User) 
			return this.service.findUserSessions(userId);
		return this.service.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string,@Req() req) {
		const user : JwtPayload = req.user;
		const session = await this.service.findOne(Number(id));
		if(!session){
			throw new Error('Session not found');
		}
		if (user.role === Role.User && session.userId !== user.id) {
			throw new Error('Unauthorized to access this session');
		}
		return session;
	}

	@Post()
	async create(@Body() createSessionDto: Partial<CreateSessionDto>, @Req() req) {
		const user : JwtPayload = req.user;
		if(!createSessionDto.quizId){
			throw new Error('quizId is required');
		}
		const userRole = user.role ?? null;	
		if (userRole === Role.Admin) return this.service.create(createSessionDto);
		const userId = user.id ?? null;
		return this.service.createForUser(userId, createSessionDto.quizId);
	}

	@Put(':id')
	@Roles(Role.Admin)
	async update(@Param('id') id: string, @Body() updateData: Partial<CreateSessionDto>) {
		return this.service.update(Number(id), updateData);
	} 

	@Delete(':id')
	@Roles(Role.Admin)
	async delete(@Param('id') id: string) {
		return this.service.delete(Number(id));
	}

	@Get('active/')
	async findAllActive(@Req() req) {
		const userId = req?.user?.id; // id from JWT token
		return this.service.findUserSessions(userId, sessionStatus.IN_PROGRESS);
	}

	@Get('active/:quizId')//user access
	async findActive(@Param('quizId') quizId: string, @Req() req) {
		const userId = req?.user?.id; // id from JWT token
		return this.service.findActiveSession(userId, Number(quizId));
	}

	@Patch(':id/start')
	async start(@Param('id') id: string, @Req() req) {
		const user : JwtPayload = req.user;
		return this.service.startSession(Number(id), user.id);
	}

	@Post(':id/sync')
	async sync(@Param('id') id: string, @Req() req, @Body() answers: BatchAnswersDto) {
		const user : JwtPayload = req.user;
		this.logger.log(`session's id is ${user.id}`);
		return this.service.syncBySessionId(Number(id), user.id, answers);
	}

	@Patch(':id/resume')
	async resume(@Param('id') id: string, @Req() req) {
		const user : JwtPayload = req.user;
		const userId = user.id; // id from JWT token
		return this.service.resumeSession(Number(id), userId);
	}

	@Post(':id/finish')
	async finish(@Param('id') id: string, @Req() req, @Body() answers: BatchAnswersDto) {
		const user : JwtPayload = req.user;
		this.logger.log(`Finding active sessions for user ID: ${answers}`);		
		return this.service.finishBySessionId(Number(id), user.id, answers);
	}


}
