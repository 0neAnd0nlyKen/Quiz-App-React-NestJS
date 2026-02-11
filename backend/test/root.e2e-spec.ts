import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer } from './e2e-setup';

describe('Root Controller (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    app = await setupTestApp();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/ (GET)', () => {
    const server = getServer(app);
    return server().get('/').expect(200).expect('Hello World!');
  });
});
