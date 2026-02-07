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
} from '@nestjs/common';
import { UserQuizSessionsService } from './user-quiz-session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SyncSessionDto } from './dto/sync-session.dto';
import { Roles, Role } from '../auth/guards/roles/roles.decorator';

@Controller('sessions')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserQuizSessionController {
	constructor(private service: UserQuizSessionsService) {}

	// Admin CRUD (protected by Roles)
	@Get('admin')
	// @Roles(Role.Admin)
	async adminList() {
		return this.service.findAll();
	}

	@Get('admin/:id')
	// @Roles(Role.Admin)
	async adminGet(@Param('id') id: string) {
		return this.service.findOne(Number(id));
	}

	@Patch('admin/:id')
	// @Roles(Role.Admin)
	async adminUpdate(@Param('id') id: string, @Body() body: any) {
		return this.service.update(Number(id), body);
	}

	@Post('admin')
	// @Roles(Role.Admin)
	async adminCreate(@Body() body: any) {
		return this.service.create(body);
	}

	@Patch('admin/:id/delete')
	// @Roles(Role.Admin)
	async adminDelete(@Param('id') id: string) {
		await this.service.delete(Number(id));
		return { deleted: true };
	}

	// User routes
	@Get('me')
	async myAccepted(@Req() req: any) {
		const userId = req.user?.userId || req.user?.id;
		return this.service.findForUserNotCompleted(userId);
	}

	@Post()
	async acceptQuiz(@Req() req: any, @Body() dto: CreateSessionDto) {
		const userId = req.user?.userId || req.user?.id;
		return this.service.createForUser(userId, dto.quizId);
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
