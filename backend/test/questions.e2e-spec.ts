import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer, loginAdminUser } from './e2e-setup';

describe('Questions (e2e)', () => {
  let app: INestApplication<App>;
  let questionId: number;
  let quizId: number = 1; // fallback
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

  it('should get all questions', async () => {
    const server = getServer(app);
    const response = await server()
      .get('/questions')
      .set('Authorization', `Bearer ${adminToken}`);
    // console.log('All Questions:', response.body);
    expect(response.body[0]).toHaveProperty('id');
  });

  it('should create a new question', async () => {
    const server = getServer(app);
    
    // Create a quiz first
    const quizResponse = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Quiz for Questions',
        description: 'Quiz to hold questions',
      });

    if (quizResponse.body?.id) {
      quizId = quizResponse.body.id;
    }

    const response = await server()
      .post('/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: 'What is the capital of France?',
        quizId: quizId,
        correctAnswer: true,
      });
    // console.log('Created Question:', response.body);
    expect(response.body).toHaveProperty('id');
    if (response.body?.id) {
      questionId = response.body.id;
    }
  });

  it('should get a question by id', async () => {
    const server = getServer(app);
    const getResponse = await server()
      .get(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    // console.log('Get by ID Response:', getResponse.body);  
    expect(getResponse.body.text).toBe('What is the capital of France?');
  });

  it('should update a question', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: 'Question to Update',
        quizId: quizId,
      });

    if (createResponse.body?.id) {
      const updateResponse = await server()
        .put(`/questions/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ text: 'Updated Question Text' });
      // console.log('Update Response:', updateResponse.body);
      expect(updateResponse.body.text).toBe('Updated Question Text');
    }
  });

  it('should delete a question', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        text: 'Question to Delete',
        quiz_id: quizId,
      });

    if (createResponse.body?.id) {
      const deleteResponse = await server()
        .delete(`/questions/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      // console.log('Delete Response:', deleteResponse.body);
      expect(deleteResponse.body.message).toBe('Question deleted successfully');
    }
  });
});
