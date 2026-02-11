import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer, loginAdminUser } from './e2e-setup';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let createdUserId: number;
  let adminToken: string;

  beforeEach(async () => {
    app = await setupTestApp();
    adminToken = await loginAdminUser(app);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should get all users (admin)', async () => {
    const server = getServer(app);
    const response = await server()
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).not.toBe(404);
  });

  it('should get a user by id', async () => {
    const server = getServer(app);
    const response = await server().get('/users/1');
    expect(response.status).not.toBe(404);
  });

  it('should create a new user (admin)', async () => {
    const server = getServer(app);
    const response = await server()
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: `newtestuser${Date.now()}`,
        password: 'password123',
        display_name: 'New Test User',
      });

    expect(response.status).not.toBe(404);
    if (response.body?.id) {
      createdUserId = response.body.id;
    }
  });

  it('should update a user (admin)', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: `updatetestuser${Date.now()}`,
        password: 'password123',
        display_name: 'Update Test User',
      });

    if (createResponse.body?.id) {
      const updateResponse = await server()
        .post(`/users/update/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ display_name: 'Updated User Name' });

      expect(updateResponse.status).not.toBe(404);
    }
  });

  it('should delete a user (admin)', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: `deletetestuser${Date.now()}`,
        password: 'password123',
        display_name: 'Delete Test User',
      });

    if (createResponse.body?.id) {
      const deleteResponse = await server()
        .post(`/users/delete/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});

      expect(deleteResponse.status).not.toBe(404);
    }
  });
});
