const app = require('../app.js');
const { sequelize } = require('../models');
const request = require('supertest');
const { queryInterface } = sequelize;

const userData = {
  email: 'ziady@mail.com',
  password: '12345',
};

afterAll((done) => {
  queryInterface
    .bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe('User Routes Test', () => {
  describe('POST /register - create new user', () => {
    test('201 Success register - should create new User', (done) => {
      request(app)
        .post('/register')
        .send(userData)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('email', userData.email);
          done();
        })
        .catch((err) => {
          done(err);
        });
    }, 5000);

    test('400 Failed register - should return error if email is null', (done) => {
      request(app)
        .post('/register')
        .send({
          password: 'qweqwe',
        })
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Email is required');
          done();
        })
        .catch((err) => {
          done(err);
        });
    }, 5000);

    test('400 Failed register - should return error if email is already exists', (done) => {
      request(app)
        .post('/register')
        .send(userData)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Email must be unique');
          done();
        })
        .catch((err) => {
          done(err);
        });
    }, 5000);

    test('400 Failed register - should return error if email have invalid format', (done) => {
      request(app)
        .post('/register')
        .send({
          email: 'user.com',
          password: 'qweqwe',
        })
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Invalid email format');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }, 5000);

  describe('POST /login - user login', () => {
    test('200 Success login - should return access_token', (done) => {
      request(app)
        .post('/login')
        .send(userData)
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(200);
          expect(body).toHaveProperty('access_token', expect.any(String));
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    test('401 Failed login - should return error', (done) => {
      request(app)
        .post('/login')
        .send({
          email: 'hello@mail.com',
          password: 'salahpassword',
        })
        .then((response) => {
          const { body, status } = response;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid email/password');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
