const supertest = require('supertest');
const { factory } = require('factory-girl');
const _ = require('lodash');

const dbHelper = require('../helpers/db');
const usersTestData = require('../data/users');
const app = require('../../app');
const { errorMessages } = require('../../app/constants');

const postUsersPath = '/users';
const defaultHeaders = ['Accept', 'application/json'];
const timeStamps = ['created_at', 'updated_at'];

describe('Create users POST  /users', () => {
  let status = 0;
  let body = {};

  describe('Should work correctly with satisfactory case', () => {
    beforeEach(async () => {
      ({ status, body } = await supertest(app)
        .post(postUsersPath)
        .set(...defaultHeaders)
        .send(usersTestData.createUserRequestBody));
    });

    test('Should return a created status code', () => {
      expect(status).toBe(201);
    });

    test('Should return the created user info without password', () => {
      const userInfo = _.omit(body, [...timeStamps, 'id']);

      expect(userInfo).toMatchObject(usersTestData.expectedUserInfo);
    });

    test('Should save the user with the correct information', async () => {
      const { id } = body;

      const foundUser = await dbHelper.findUserById(id);
      const cleanedFoundUser = _.omit(foundUser, [...timeStamps, 'password']);

      expect(cleanedFoundUser).toStrictEqual({ id, ...usersTestData.expectedUserInfo });
    });
  });

  describe('Should fail correctly with schema error cases', () => {
    const schemaErrorStatus = 422;

    afterEach(() => {
      expect(status).toBe(schemaErrorStatus);
    });

    test('Should return the correct error when the provided password length is lower than 8', async () => {
      const shortPassword = '1234';

      ({ status, body } = await supertest(app)
        .post(postUsersPath)
        .set(...defaultHeaders)
        .send({ ...usersTestData.createUserRequestBody, password: shortPassword }));

      expect(body).toStrictEqual(
        usersTestData.getSchemaErrorResponse([
          {
            location: 'body',
            msg: errorMessages.shortPassword,
            param: 'password',
            value: shortPassword
          }
        ])
      );
    });

    test('Should return the correct error when the provided password is not alphanumeric', async () => {
      const notAlphanumericPassword = '@#¢∞¬¬÷“”“∞';

      ({ status, body } = await supertest(app)
        .post(postUsersPath)
        .set(...defaultHeaders)
        .send({ ...usersTestData.createUserRequestBody, password: notAlphanumericPassword }));

      expect(body).toStrictEqual(
        usersTestData.getSchemaErrorResponse([
          {
            location: 'body',
            msg: errorMessages.alphanumeric,
            param: 'password',
            value: notAlphanumericPassword
          }
        ])
      );
    });

    test.each(['first_name', 'last_name', 'email', 'password'])(
      'Should return the correct error when %s is not provided',
      async obligatoryField => {
        ({ status, body } = await supertest(app)
          .post(postUsersPath)
          .set(...defaultHeaders)
          .send({ ...usersTestData.createUserRequestBody, [obligatoryField]: null }));

        expect(body).toStrictEqual(
          usersTestData.getSchemaErrorResponse([
            {
              location: 'body',
              msg: errorMessages.providedAndNotEmpty,
              param: obligatoryField,
              value: null
            }
          ])
        );
      }
    );

    test('Should return the correct error when the email is already in our records', async () => {
      await factory.create('user', usersTestData.user);
      const { email } = usersTestData.user;

      ({ status, body } = await supertest(app)
        .post(postUsersPath)
        .set(...defaultHeaders)
        .send(usersTestData.createUserRequestBody));

      expect(body).toStrictEqual(
        usersTestData.getSchemaErrorResponse([
          {
            location: 'body',
            msg: errorMessages.alreadyInRegisters,
            param: 'email',
            value: email
          }
        ])
      );
    });
  });
});
