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
} from '@nestjs/common';
import { UserQuizSessionsService } from './user-quiz-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SyncSessionDto } from './dto/sync-session.dto';
import { Roles, Role } from '../auth/guards/roles/roles.decorator';
import { BatchAnswersDto, CreateAnswerDto } from '../answers/dto/create-answer.dto';
import { sessionStatus } from './entities/user-quiz-session.entity';

@Controller('sessions')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserQuizSessionController {
	constructor(private service: UserQuizSessionsService) {}

	@Get()
	async findAll(@Req() req) {
		if (req?.user?.role === Role.User) 
			return this.service.findUserSessions(req?.user?.id);
		return this.service.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string,@Req() req) {
		const session = await this.service.findOne(Number(id));
		if(!session){
			throw new Error('Session not found');
		}
		if (req?.user?.role === Role.User && session.userId !== req?.user?.id) {
			throw new Error('Unauthorized to access this session');
		}
		return session;
	}

	@Post()
	async create(@Body() createSessionDto: Partial<CreateSessionDto>, @Req() req) {
		if(!createSessionDto.quizId){
			throw new Error('quizId is required');
		}
		const userRole = req?.user?.role ?? null;	
		if (userRole === Role.Admin) return this.service.create(createSessionDto);
		const userId = req?.user?.id ?? null;
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
		return this.service.startSession(Number(id), req?.user?.id);
	}

	@Patch(':id/sync')
	async sync(@Param('id') id: string, @Req() req, @Body() answers: BatchAnswersDto) {
		return this.service.syncBySessionId(Number(id), req?.user?.id, answers);
	}

	@Patch(':id/resume')
	async resume(@Param('id') id: string, @Req() req) {
		const userId = req?.user?.id; // id from JWT token
		return this.service.resumeSession(Number(id), userId);
	}

	@Post(':id/finish')
	async finish(@Param('id') id: string, @Req() req, @Body() answers: BatchAnswersDto) {
		return this.service.finishBySessionId(Number(id), req?.user?.id, answers);
	}


}
