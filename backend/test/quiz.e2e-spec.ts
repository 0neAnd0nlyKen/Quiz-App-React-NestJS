import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer, loginAdminUser } from './e2e-setup';

describe('Quiz (e2e)', () => {
  let app: INestApplication<App>;
  let quizId: number;
  let adminToken: string ;
  let questionId: number ;

  beforeEach(async () => {
    app = await setupTestApp();
    adminToken = await loginAdminUser(app);
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should get all quizzes (public)', async () => {
    const server = getServer(app);
    const response = await server().get('/quiz').set('Authorization', `Bearer ${adminToken}`);
    // console.log("all quizzes:",response.body);
    expect(response.status).not.toBe(404);
  });
  
  it('should create a new quiz (admin)', async () => {
      const server = getServer(app);
      const response = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
          name: 'Test Quiz',
          description: 'This is a test quiz',
        });
        // console.log('Create Quiz Response:', response.body);
        expect(response.status).not.toBe(404);
        // console.log(response.body);
        if (response.body?.id) {
            quizId = response.body.id;
        }
    });
    it('should get new quiz', async () => {
        const server = getServer(app);
        const response = await server().get(`/quiz/${quizId}`).set('Authorization', `Bearer ${adminToken}`);
        // console.log('Get New Quiz Response:', response.body);
        // console.log(response.body);
        expect(response.body.name).toBe('Test Quiz');
    });

    it('should create questions for new quiz', async () => {
        const server = getServer(app);
        const newQuestonRes = await server()
          .post(`/questions`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
              text: 'Sample Question',
              quizId: quizId,
              correctAnswer: true,
          });
        // console.log("new question for new quiz:",newQuestonRes.body);
        expect(newQuestonRes.body.text).toBe('Sample Question');

    });
    it('should get quiz questions', async () => {
        const server = getServer(app);
        const response = await server()
          .get(`/quiz/${quizId}/questions`)
          .set('Authorization', `Bearer ${adminToken}`);
        expect(response.body[0].text).toBe('Sample Question');
        // console.log("questions for new quiz: ",response.body);
    });
    
  it('should update a quiz (admin)', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Quiz Name',
        description: 'This quiz will be updated',
      });

    if (createResponse.body?.id) {
      const updateResponse = await server()
        .post(`/quiz/update/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Quiz Name' });

      expect(updateResponse.status).not.toBe(404);
      // console.log("updated quiz:",updateResponse.body);
    }
  });

  it('should delete a quiz (admin)', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Quiz to Delete',
        description: 'This quiz will be deleted',
      });

    if (createResponse.body?.id) {
      const deleteResponse = await server()
        .delete(`/quiz/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({});
        
      // console.log("delete response body:",deleteResponse.body);
      expect(deleteResponse.body.message).toBeDefined();
    }
  });
});
