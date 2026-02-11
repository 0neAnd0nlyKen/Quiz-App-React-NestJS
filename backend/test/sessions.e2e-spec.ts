import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { setupTestApp, getServer, loginAdminUser, loginRegularUser } from './e2e-setup';
import { CreateQuestionDto } from 'src/modules/auth/dto/creat-question.dto';
import { BatchAnswersDto } from 'src/modules/answers/dto/create-answer.dto';

describe('Sessions (e2e)', () => {
  let app: INestApplication<App>;
  let sessionId: number;
  let userId: number = 3; // fallback
  let quizId: number = 1; // fallback
  let adminToken: string = "";
  let userToken: string = "";
  let questionId: number;
  let currentTime = Date.now();
  let userEmail = `test${currentTime}@email.com`

  beforeEach(async () => {
    app = await setupTestApp();
    if (adminToken === "") adminToken = await loginAdminUser(app);
    if (userToken === "") userToken = await loginRegularUser(app); 
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should get all sessions (admin)', async () => {
    const server = getServer(app);
    const response = await server()
      .get('/sessions')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.body[0]).toBeDefined;
  });

  it('should create a new session', async () => {
    const server = getServer(app);
    
    const quizResponse = await server()
      .post('/quiz')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Quiz for Sessions',
        description: 'Quiz for session testing',
      });
      // console.log('Created Quiz:', quizResponse.body.id);
      expect(quizResponse.body.id).toBeDefined();
    if (quizResponse.body?.id) {
      quizId = quizResponse.body.id;
    }
    
    const newQuestion: CreateQuestionDto = {
      text: 'Is this a test question?',
      correctAnswer: true,
      quizId: quizId,
    };

    const questionResponse = await server()
      .post('/questions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newQuestion);

    if (questionResponse.body?.id) {
      questionId = questionResponse.body.id;
    }

    const registerResponse = await server()
      .post('/auth/register')
      .send({
        email: userEmail,
        password: 'password123',
        display_name: 'test'
      });
    // console.log(`register success? ${registerResponse.body.id}`);
    expect(registerResponse.body.id).toBeDefined();
      const userResponse = await server()
      .post('/auth/login')
      .send({
          email: userEmail,
          password: 'password123',
      });
    // console.log(`logged in success? ${userResponse.body.access_token}`);
    if (userResponse.body?.user?.id) {
      userId = userResponse.body.user.id;
      userToken = userResponse.body.access_token;
      // console.log(`Logged in test user with ID: ${userId} and token ${userToken}`);
      expect(userResponse.body.access_token).toBeDefined();
    }
    const response = await server()
      .post('/sessions')
      .send({
        user_id: userId,
        quizId: quizId,
      })
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.body.id).toBeDefined();
    if (response.body?.id) {
      sessionId = response.body.id;
    }

    const quizQuestionsResponse = await server()
      .get(`/quiz/${quizId}/questions`)
      .set('Authorization', `Bearer ${adminToken}`);

      // console.log('Quiz Questions:', quizQuestionsResponse.body);
      expect(quizQuestionsResponse.body[0].id).toBeDefined();
  });

  it('should get a session by id', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/sessions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        quizId: quizId,
        userId: userId,
      });

    if (createResponse.body?.id) {
      const getResponse = await server().get(`/sessions/${createResponse.body.id}`).set('Authorization', `Bearer ${adminToken}`);
      // console.log('Get Session Response:', getResponse.body);
      expect(getResponse.body.id).toBeDefined();
      sessionId = createResponse.body.id;
    }
  });

  it('should get active sessions for logged in user', async () => {
    const server = getServer(app);
    const response = await server()
      .get(`/sessions/active/`)
      .set('Authorization', `Bearer ${userToken}`);
    // console.log('Active Sessions:', response.body);
    expect(response.body).toBeDefined();
  });

  it('should get active session', async () => {
    const server = getServer(app);
    const response = await server()
      .get(`/sessions/active/${quizId}`)
      .set('Authorization', `Bearer ${userToken}`);
    // console.log('Active Session:', response.body);
    expect(response.body).toBeDefined();
  });

  it('should start a session', async () => {
    const server = getServer(app);
    // console.log("UPDATING SESSION AS USER", userId, sessionId);
    // console.log("TOKEN", userToken);
    const startResponse = await server()
      .patch(`/sessions/${sessionId}/start`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

    // console.log('Start Session Response:', startResponse.body);
    expect(startResponse.body.session.status).toBe('in_progress');
  });

  it('should sync a session', async () => {
    const server = getServer(app);  
      const syncResponse = await server()
      .post(`/sessions/${sessionId}/sync`)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'application/json')       // Set content type
      .set('Accept', 'application/json')            // Set accept header
      .send({
        answers: [
          {
            userId: userId,
            questionId: questionId,
            userAnswer: true
          },
        ]
      });

      // console.log('Sync Session Response:', syncResponse.body);
    expect(syncResponse.body.status).toBe('pending');
  });

  it('should resume a session', async () => {
    const server = getServer(app);
    
    const resumeResponse = await server()
      .patch(`/sessions/${sessionId}/resume`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});

      // console.log('Resume Session Response:', resumeResponse.body);
    expect(resumeResponse.body.session.status).toBe('pending')
  });

  it('should finish a session', async () => {
    const server = getServer(app);
    const finishResponse = await server()
      .post(`/sessions/${sessionId}/finish`)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Content-Type', 'application/json')       // Set content type
      .set('Accept', 'application/json')            // Set accept header
      .send({
        answers: [
          {
            userId: userId,
            questionId: questionId,
            userAnswer: true
          },
        ]
      });

      // console.log('Finish Session Response:', finishResponse.body);
      expect(finishResponse.body.score).toBeDefined();
  });

  it('should update a session (admin)', async () => {
    const server = getServer(app);

      const updateResponse = await server()
        .put(`/sessions/${sessionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ score: 50 });

        // console.log('Update Session Response:', updateResponse.body);
        expect(updateResponse.body.score).toBe(50);
  });

  it('should delete a session (admin)', async () => {
    const server = getServer(app);
    
    const createResponse = await server()
      .post('/sessions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        quizId: quizId,
      });

    if (createResponse.body?.id) {
      const deleteResponse = await server()
        .delete(`/sessions/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(deleteResponse.body.message).toBeDefined();
    }
  });
});
