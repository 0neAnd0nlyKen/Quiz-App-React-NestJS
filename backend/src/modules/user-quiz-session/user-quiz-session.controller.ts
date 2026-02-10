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

@Controller('sessions')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserQuizSessionController {
	constructor(private service: UserQuizSessionsService) {}

	@Get()
	@Roles(Role.Admin)
	async findAll() {
		return this.service.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.service.findOne(Number(id));
	}

	@Post()
	async create(@Body() createSessionDto: CreateSessionDto, @Req() req) {
		const userRole = req?.user?.role ?? null;
		if (userRole === Role.Admin) return this.service.create(createSessionDto);
		const userId = req?.user?.id ?? null;
		return this.service.createForUser(userId, createSessionDto.quizId);
	}

	@Put(':id')
	@Roles(Role.Admin)
	async update(@Param('id') id: string, @Body() updateData: Partial<CreateSessionDto>) {
	} 

	@Delete(':id')
	@Roles(Role.Admin)
	async delete(@Param('id') id: string) {
		return this.service.delete(Number(id));
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

	@Get(':quizId')
	async startOrResume(@Req() req: any, @Param('quizId') quizId: string) {
		const userId = req.user?.userId || req.user?.id;
		const session = await this.service.findByUserAndQuiz(userId, Number(quizId));
		if (!session) return { current_index: 0, seconds_remaining: 0 };
		return {
			current_index: session.currentQuestionIndex,
			seconds_remaining: session.secondsRemaining,
		};
	}

	@Patch(':quizId/sync')
	async sync(@Req() req: any, @Param('quizId') quizId: string, @Body() dto: SyncSessionDto) {
		const userId = req.user?.userId || req.user?.id;
		return this.service.syncTimer(userId, Number(quizId), dto.secondsRemaining);
	}

	@Post(':quizId/finish')
	async finish(@Req() req: any, @Param('quizId') quizId: string) {
		const userId = req.user?.userId || req.user?.id;
		return this.service.finishSession(userId, Number(quizId));
	}
}
