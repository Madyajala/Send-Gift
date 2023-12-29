const app = require('../app.js');
const { User, sequelize } = require('../models');
const request = require('supertest');
const { queryInterface } = sequelize;
const { createToken } = require('../helpers/jwt');

const userData = {
  email: 'afifah@mail.com',
  password: '123456',
};

const userData2 = {
  email: 'rahma@mail.com',
  password: '123456',
};

let dataGift = {
  message: 'Happy Birthday My Friend',
  amount: 500000,
};

let dataGift2 = {
  message: '',
  amount: 500000,
};

let userToken1, userToken2, senderId, receiverId, giftId;

let invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJvbm9AbWFpbC5jb20iLCJpZCI6MSwiaWF0IjoxNjIxMTYzNDYyfQ.WhdvxtOveekRlXU0';

beforeAll((done) => {
  User.create(userData)
    .then((data) => {
      senderId = data.id;
      userToken1 = createToken({ id: data.id, email: data.email }, 'secret');
      return User.create(userData2);
    })
    .then((data2) => {
      receiverId = data2.id;
      dataGift['receiverId'] = receiverId;
      dataGift2['receiverId'] = receiverId;
      userToken2 = createToken({ id: data2.id, email: data2.email }, 'secret');
      return queryInterface.bulkInsert(
        'Vouchers',
        [
          {
            title: 'Thank You Gift Voucher',
            tag: 'general',
            imageUrl: 'https://cdn.dribbble.com/users/416805/screenshots/15604755/media/f279c6ce7d2ef61fe1b301ce6f1cd509.jpg?compress=1&resize=1600x1200',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Christmas Gift Voucher',
            tag: 'christmas',
            imageUrl: 'https://cdn.dribbble.com/users/4540442/screenshots/9126525/media/0abbd18b7aa27a9835ae2f6ea4d61371.png?compress=1&resize=1600x1200',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Christmas Gift Voucher 2',
            tag: 'christmas',
            imageUrl: 'https://cdn.dribbble.com/users/322873/screenshots/9152565/media/d2a7e512056ae61e1cb67d7b8d251ca5.jpg?compress=1&resize=1600x1200',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  queryInterface
    .bulkDelete('Users', null, { truncate: true, cascade: true, restartIdentity: true })
    .then(() => {
      return queryInterface.bulkDelete('Vouchers', null, { truncate: true, cascade: true, restartIdentity: true });
    })
    .then(() => {
      return queryInterface.bulkDelete('Gifts', null, { truncate: true, cascade: true, restartIdentity: true });
    })
    .then(() => {
      done();
    })
    .catch((err) => done(err));
});

describe('GET /vouchers', () => {
  test('200 success get vouchers', (done) => {
    request(app)
      .get('/vouchers')
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 get vouchers without token', (done) => {
    request(app)
      .get('/vouchers')
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        const executionTime = endTime - startTime;
        console.log(`Test execution time: ${executionTime} ms`, '<<<==>>>');
        done();
      })
      .catch((err) => {
        done(err);
      });
  }, 100000);

  test('401 get vouchers invalid token', (done) => {
    request(app)
      .get('/vouchers')
      .set('Authorization', `Bearer ${invalidToken}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        const executionTime = endTime - startTime;
        console.log(`Test execution time: ${executionTime} ms`, '<<<++>>>');
        done();
      })
      .catch((err) => {
        done(err);
      });
  }, 100000);
});

describe('POST /gifts/:voucherId', () => {
  test('201 success send gifts', (done) => {
    request(app)
      .post('/gifts/1')
      .send(dataGift)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        giftId = body.id;
        expect(status).toBe(201);
        expect(body).toHaveProperty('id', expect.any(Number));
        expect(body).toHaveProperty('message', 'Happy Birthday My Friend');
        expect(body).toHaveProperty('senderId', senderId);
        expect(body).toHaveProperty('amount', 500000);
        expect(body).toHaveProperty('receiverId', receiverId);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 send gifts without token', (done) => {
    request(app)
      .post('/gifts/2')
      .send(dataGift)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);

        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 send gifts invalid token', (done) => {
    request(app)
      .get('/gifts/2')
      .set('Authorization', `Bearer ${invalidToken}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('404 send gifts failed cause not found', (done) => {
    request(app)
      .post('/gifts/99')
      .send(dataGift2)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty('message', 'Data not found');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('GET /gifts', () => {
  test('200 success get all gifts', (done) => {
    request(app)
      .get('/gifts')
      .set('Authorization', `Bearer ${userToken2}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(Array.isArray(body)).toBeTruthy();
        expect(body.length).toBeGreaterThan(0);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 get all gifts without token', (done) => {
    request(app)
      .get('/gifts/')
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);

        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 get all gifts invalid token', (done) => {
    request(app)
      .get('/gifts')
      .set('Authorization', `Bearer ${invalidToken}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);

        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('PATCH /gifts/:id', () => {
  test('200 success update gifts', (done) => {
    request(app)
      .patch(`/gifts/${giftId}`)
      .send(dataGift)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        giftId = body.id;
        expect(status).toBe(200);
        expect(body).toHaveProperty('id', expect.any(Number));
        expect(body).toHaveProperty('message', 'Happy Birthday My Friend');
        expect(body).toHaveProperty('senderId', senderId);
        expect(body).toHaveProperty('amount', 500000);
        expect(body).toHaveProperty('receiverId', receiverId);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 send gifts without token', (done) => {
    request(app)
      .patch(`/gifts/${giftId}`)
      .send(dataGift)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);

        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 send gifts invalid token', (done) => {
    request(app)
      .patch(`/gifts/${giftId}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('404 update gifts failed cause not found', (done) => {
    request(app)
      .patch('/gifts/99')
      .send(dataGift2)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty('message', 'Data not found');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('403 update gifts failed unauthorized user', (done) => {
    request(app)
      .patch(`/gifts/${giftId}`)
      .send(dataGift2)
      .set('Authorization', `Bearer ${userToken2}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(403);
        expect(body).toHaveProperty('message', "You are not authorized");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('PATCH /gifts/:id/claim', () => {
  test('200 success claim gifts', (done) => {
    request(app)
      .patch(`/gifts/${giftId}/claim`)
      .set('Authorization', `Bearer ${userToken2}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toHaveProperty('message', 'Gift has been claimed');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('403 claim gift unauthorized user', (done) => {
    request(app)
      .patch(`/gifts/${giftId}/claim`)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(403);
        expect(body).toHaveProperty('message', 'You are not authorized');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 claim gift without token', (done) => {
    request(app)
      .patch(`/gifts/${giftId}/claim`)
      .send(dataGift)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 claim gift invalid token', (done) => {
    request(app)
      .patch(`/gifts/${giftId}/claim`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(401);
        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('404 claim gift not found', (done) => {
    request(app)
      .patch(`/gifts/99/claim`)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty('message', 'Data not found');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('DELETE /gifts/:id', () => {
  test('403 delete gifts unauthorized user', (done) => {
    request(app)
      .delete(`/gifts/${giftId}`)
      .set('Authorization', `Bearer ${userToken2}`)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(403);
        expect(body).toHaveProperty('message', "You are not authorized");
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('200 success delete gifts', (done) => {
    request(app)
      .delete(`/gifts/${giftId}`)
      .send(dataGift)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(200);
        expect(body).toHaveProperty('message', 'Gift has been deleted');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('401 delete gifts without token', (done) => {
    request(app)
      .delete(`/gifts/${giftId}`)
      .send(dataGift)
      .then((response) => {
        const { body, status } = response;
        expect(status).toBe(401);

        expect(body).toHaveProperty('message', 'Invalid token');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  test('404 delete gifts failed cause not found', (done) => {
    request(app)
      .delete('/gifts/99')
      .send(dataGift2)
      .set('Authorization', `Bearer ${userToken1}`)
      .then((response) => {
        const { body, status } = response;

        expect(status).toBe(404);
        expect(body).toHaveProperty('message', 'Data not found');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
