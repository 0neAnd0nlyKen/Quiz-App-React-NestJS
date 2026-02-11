/**
 * E2E Tests - Split into separate files for modularity
 * 
 * Test files:
 * - root.e2e-spec.ts - Root route testing
 * - auth-register.e2e-spec.ts - Auth register endpoint
 * - auth-login.e2e-spec.ts - Auth login endpoint
 * - users.e2e-spec.ts - User CRUD operations
 * - quiz.e2e-spec.ts - Quiz CRUD operations
 * - questions.e2e-spec.ts - Questions CRUD operations
 * - answers.e2e-spec.ts - Answers CRUD operations
 * - sessions.e2e-spec.ts - Sessions management
 * 
 * Run all tests with: npm run test:e2e
 */
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer } from './e2e-setup';

describe('App Controller (e2e)', () => {
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


