const supertest = require('supertest');
const { factory } = require('factory-girl');

const usersTestData = require('../../data/users');
const rolesTestData = require('../../data/roles');
const app = require('../../../app');
const { errorMessages } = require('../../../app/constants');

const defaultHeaders = ['Accept', 'application/json'];

let status = 0;
let body = {};
const schemaErrorStatus = 422;
const signInPath = '/users/sessions';

describe('Signs in users POST /users/sessions', () => {
  beforeEach(async () => {
    const { id: roleId } = await factory.create('role', rolesTestData.regRole);
    await factory.create('user', { ...usersTestData.user, roleId });
  });

  describe('Should work correctly with the satisfactory case', () => {
    beforeEach(async () => {
      ({ status, body } = await supertest(app)
        .post(signInPath)
        .set(...defaultHeaders)
        .send(usersTestData.signInRequestBody));
    });

    test('Should return a success status', () => {
      expect(status).toBe(200);
    });

    test('Should return a token', () => {
      const { token } = body;

      expect(token).toBeDefined();
    });
  });

  describe('Should fail correctly with schema error cases', () => {
    afterEach(() => expect(status).toBe(schemaErrorStatus));

    test.each(['email', 'password'])(
      'Should return the correct error when %s is not provided',
      async obligatoryField => {
        ({ status, body } = await supertest(app)
          .post(signInPath)
          .set(...defaultHeaders)
          .send({ ...usersTestData.signInRequestBody, [obligatoryField]: null }));

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

    test('Should return an error when the email does not belong to wolox domain', async () => {
      const wrongEmail = 'wrong@wrong.com';

      ({ status, body } = await supertest(app)
        .post(signInPath)
        .set(...defaultHeaders)
        .send({ ...usersTestData.signInRequestBody, email: wrongEmail }));

      expect(body).toStrictEqual(
        usersTestData.getSchemaErrorResponse([
          {
            location: 'body',
            msg: errorMessages.woloxDomain,
            param: 'email',
            value: wrongEmail
          }
        ])
      );
    });
  });

  describe('Should fail correctly when the credentials do not match', () => {
    beforeEach(async () => {
      ({ status, body } = await supertest(app)
        .post(signInPath)
        .set(...defaultHeaders)
        .send({ ...usersTestData.signInRequestBody, password: 'omgIForgot' }));
    });

    test('Should return an unauthorized status', () => {
      expect(status).toBe(401);
    });

    test('Should return the correct error', () => {
      expect(body).toStrictEqual({
        message: 'The provided credentials do not match with our records',
        internal_code: 'unauthorized'
      });
    });
  });

  describe('Should fail correctly when the email is not found', () => {
    const notFoundEmail = 'notFound@wolox.com';

    beforeEach(async () => {
      ({ status, body } = await supertest(app)
        .post(signInPath)
        .set(...defaultHeaders)
        .send({ ...usersTestData.signInRequestBody, email: notFoundEmail }));
    });

    test('Should return a not found status status', () => {
      expect(status).toBe(404);
    });

    test('Should return the correct error', () => {
      expect(body).toStrictEqual({
        message: `User with email ${notFoundEmail} not found`,
        internal_code: 'not_found'
      });
    });
  });
});
