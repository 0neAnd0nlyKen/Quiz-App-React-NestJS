import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer, loginAdminUser } from './e2e-setup';

describe('Answers (e2e)', () => {
  let app: INestApplication<App>;
  let answerId: number;
  let questionId: number = 1; // fallback
  let quizId: number = 1; // fallback
  let adminToken: string;

  beforeEach(async () => {
    app = await setupTestApp();
    adminToken = await loginAdminUser(app);
  })

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should get all answers', async () => {
    const server = getServer(app);
    const response = await server()
      .get('/answers')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body).toBeDefined();
    // console.log("All answers:",response.body);
  });

  it('should create a new answer', async () => {
    const server = getServer(app);
    
    // Create quiz and question first
    const quizResponse = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Quiz for Answers',
        description: 'Quiz to hold questions',
      });

    if (quizResponse.body?.id) {
      quizId = quizResponse.body.id;
    }

    const questionResponse = await server()
      .post('/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: '6 9?',
        quiz_id: quizId,
        userAnswer: true,
      });

    if (questionResponse.body?.id) {
      questionId = questionResponse.body.id;
    }

    const response = await server()
      .post('/answers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId      : 1,
        questionId  : questionId,
        userAnswer  : true,
      });

    expect(response.body.id).toBeDefined();
    // console.log("Created answer:", response.body);
    if (response.body?.id) {
      answerId = response.body.id;
    }
  });

  it('should get an answer by id', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .get(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(createResponse.body.id).toBe(answerId);
    // console.log("Answer by ID:", createResponse.body);
  });

  it('should update an answer', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .put(`/answers/${answerId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ userAnswer: false });

    expect(createResponse.body.userAnswer).toBe(false);
    // console.log("Updated answer:",createResponse.body);
  });

  it('should delete an answer', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .delete(`/answers/${answerId}`)
        .set('Authorization', `Bearer ${adminToken}`);

    expect(createResponse.body.message).toBeDefined();
    // console.log("Deleted answer response:",createResponse.body);
  });
});
