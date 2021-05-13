const supertest = require('supertest');
const { factory } = require('factory-girl');
const _ = require('lodash');

const usersTestData = require('../../data/users');
const app = require('../../../app');

const defaultHeaders = ['Accept', 'application/json'];
const timeStamps = ['created_at', 'updated_at'];

let status = 0;
let body = {};
const schemaErrorStatus = 422;
const usersPath = '/users';
const signInPath = '/users/sessions';

describe.only('Get users GET /users', () => {
  let token = '';

  beforeEach(async () => {
    await factory.createMany('user', 3, usersTestData.users);
    ({
      body: { token }
    } = await supertest(app)
      .post(signInPath)
      .set(...defaultHeaders)
      .send(usersTestData.signInRequestBody));
  });

  describe('Should work correctly with satisfactory case', () => {
    beforeEach(async () => {
      ({ body, status } = await supertest(app)
        .get(usersPath)
        .set(...defaultHeaders)
        .set('authorization', token));
    });

    test('Should return a success status', () => {
      expect(status).toBe(200);
    });

    test('Should return the users total', () => {
      const { count } = body;
      expect(count).toBe(usersTestData.users.length);
    });

    test('Should return the users info', () => {
      const sortFunc = (a, b) => a.email > b.email;

      const { users } = body;

      const cleanedUsers = users.map(user => _.omit(user, [...timeStamps, 'id']));

      expect(cleanedUsers.sort(sortFunc)).toStrictEqual(usersTestData.expectedUsersInfo.sort(sortFunc));
    });
  });

  describe('Should fail correctly with schema error cases', () => {
    afterEach(() => expect(status).toBe(schemaErrorStatus));

    test.each(['page', 'size'])('Should return the correct error when %s is not an integer', async field => {
      const notInteger = 2.5;
      ({ status, body } = await supertest(app)
        .get(usersPath)
        .set(...defaultHeaders)
        .set('authorization', token)
        .query({ [field]: notInteger }));

      expect(body).toStrictEqual(
        usersTestData.getSchemaErrorResponse([
          {
            location: 'query',
            msg: 'should be integer',
            param: field,
            value: `${notInteger}`
          }
        ])
      );
    });
  });

  describe('Should fail correctly when the user token is not valid', () => {
    beforeAll(async () => {
      ({ body, status } = await supertest(app)
        .get(usersPath)
        .set(...defaultHeaders)
        .set('authorization', 'wrongToken'));
    });

    test('Should return an unauthorized status', () => {
      expect(status).toBe(401);
    });

    test('Should return the correct error', () => {
      expect(body).toStrictEqual({
        internal_code: 'unauthorized',
        message: 'An error ocurred while trying to retrieve token info'
      });
    });
  });
});
