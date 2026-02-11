import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer } from './e2e-setup';

describe('Auth - Register (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should register a new user and return access token', async () => {
    const server = getServer(app);
    const currentTimestamp = Date.now();
    const response = await server()
      .post('/auth/register')
      .send({
        email: `testregister${currentTimestamp}@example.com`,
        password: 'password123',
        display_name: 'Test Register User',
      });
      
    // console.log("register result:", response.body);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', `testregister${currentTimestamp}@example.com`);
  });
});
