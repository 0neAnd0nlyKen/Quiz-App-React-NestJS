import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtStrategy } from './modules/auth/jwt-auth/jwt.strategy';
import { JwtAuthGuard } from './modules/auth/jwt-auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // Set to false in production, but true now to create tables
      ssl: { rejectUnauthorized: false }, // Required for many cloud DBs
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // JwtStrategy
    // {
    //   provide: 'APP_GUARD',
    //   useClass: JwtAuthGuard,
    // }
  ],
})
export class AppModule {}