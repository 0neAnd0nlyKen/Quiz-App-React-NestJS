import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer } from './e2e-setup';

describe('Auth - Login (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should login a user and return access token', async () => {
    const server = getServer(app);
    
    // First, register a user
    await server()
      .post('/auth/register')
      .send({
        email: 'testlogin@example.com',
        password: 'password123',
        display_name: 'Test Login User',
      });

    // Then login
    const response = await server()
      .post('/auth/login')
      .send({
        email: 'testlogin@example.com',
        password: 'password123',
      });

    expect(response.status).not.toBe(404);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
  });
});
