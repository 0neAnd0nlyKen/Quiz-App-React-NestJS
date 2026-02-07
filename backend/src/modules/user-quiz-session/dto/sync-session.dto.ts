import { IsInt } from 'class-validator';

export class SyncSessionDto {
  @IsInt()
  secondsRemaining: number;
}
