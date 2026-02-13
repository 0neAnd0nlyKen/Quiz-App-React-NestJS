// import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs'; 
const cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const hbEngine = (hbs as any).default || hbs;
  hbEngine.registerHelper('eq', function (a, b) {
    return a === b;
  });

  app.use(cookieParser());
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();