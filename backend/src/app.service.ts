import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Hello World! Hello database environment ${process.env.DATABASE_HOST}`;
  }
}
