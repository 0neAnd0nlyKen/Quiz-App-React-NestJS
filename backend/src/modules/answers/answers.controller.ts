import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { AnswersService } from './answers.service';
import { Role, Roles } from '../auth/guards/roles/roles.decorator';

@Controller('answers')
@Roles(Role.Admin)
export class AnswersController {
  constructor(private answersService: AnswersService) {}


  @Get()
  async findAll() {
    return this.answersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const answer = await this.answersService.findOne(Number(id));
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    return answer;
  }


  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answersService.create(createAnswerDto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: Partial<CreateAnswerDto>,
  ) {
    return this.answersService.update(Number(id), updateAnswerDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.answersService.delete(Number(id));
    return { message: 'Answer deleted successfully' };
  }
}
