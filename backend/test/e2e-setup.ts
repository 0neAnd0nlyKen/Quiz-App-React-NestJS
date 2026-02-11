import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

export async function setupTestApp(): Promise<INestApplication<App>> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}

export function getServer(app: INestApplication<App>) {
  return () => request(app.getHttpServer());
}

/**
 * Login an admin user and return access token
 */
export async function loginAdminUser(app: INestApplication<App>): Promise<string> {
  const server = getServer(app);
  const timestamp = Date.now();
  
  const response = await server()
    .post('/auth/login')
    .send({
      email: `kendrickraphael@gmail.com`,
      password: 'password',
    });

  // Manually set role to admin in database or assume first user is admin
  // For now, return the token
  return response.body?.access_token || '';
}

/**
 * Login a regular user and return access token
 */
export async function loginRegularUser(app: INestApplication<App>): Promise<string> {
  const server = getServer(app);
  
  const response = await server()
    .post('/auth/login')
    .send({
        email: 'testregister@example.com',
        password: 'password123',
    });

  return response.body?.access_token || '';
}
