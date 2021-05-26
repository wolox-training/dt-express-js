const supertest = require('supertest');
const { factory } = require('factory-girl');
const _ = require('lodash');
const dbHelper = require('../../helpers/db');
const usersTestData = require('../../data/users');
const rolesTestData = require('../../data/roles');
const app = require('../../../app');
const { errorMessages } = require('../../../app/constants');
const emailHelper = require('../../../app/helpers/email');
const {
  emails: {
    userCreated: { subject: userCreatedSubject, message: userCreatedMessage }
  }
} = require('../../../app/constants');

jest.mock('../../../app/helpers/email');

describe('Create users test', () => {
  let status = 0;
  let body = {};
  const schemaErrorStatus = 422;
  const defaultHeaders = ['Accept', 'application/json'];
  const timeStamps = ['created_at', 'updated_at'];
  let regRoleId = '';

  beforeEach(async () => {
    ({ id: regRoleId } = await factory.create('role', rolesTestData.regRole));
    emailHelper.sendMail.mockImplementation(() => Promise.resolve());
  });

  describe('Create users POST  /users', () => {
    const usersPath = '/users';
    describe('Should work correctly with satisfactory case', () => {
      beforeEach(async () => {
        ({ status, body } = await supertest(app)
          .post(usersPath)
          .set(...defaultHeaders)
          .send(usersTestData.createUserRequestBody));
      });

      test('Should return a created status code', () => {
        expect(status).toBe(201);
      });
      test('Should return the created user info without password', () => {
        const userInfo = _.omit(body, [...timeStamps, 'id']);

        expect(userInfo).toMatchObject({ ...usersTestData.expectedUserInfo, role_id: regRoleId });
      });
      test('Should send a notification email', () => {
        const { email } = usersTestData.createUserRequestBody;

        expect(emailHelper.sendMail).toHaveBeenCalledWith(email, userCreatedSubject, userCreatedMessage);
      });
      test('Should save the user with the correct information', async () => {
        const { id } = body;
        const foundUser = await dbHelper.findUserById(id);
        const cleanedFoundUser = _.omit(foundUser, [...timeStamps, 'password']);

        expect(cleanedFoundUser).toStrictEqual({ id, role_id: regRoleId, ...usersTestData.expectedUserInfo });
      });
    });

    describe('Should fail correctly with schema error cases', () => {
      afterEach(() => expect(status).toBe(schemaErrorStatus));

      test('Should return the correct error when the provided password length is lower than 8', async () => {
        const shortPassword = '1234';
        ({ status, body } = await supertest(app)
          .post(usersPath)
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
          .post(usersPath)
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
            .post(usersPath)
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
        await factory.create('user', { ...usersTestData.user, roleId: regRoleId });
        const { email } = usersTestData.user;
        ({ status, body } = await supertest(app)
          .post(usersPath)
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

  describe('Create admin users POST /admin/users', () => {
    const adminUsersPath = '/admin/users';
    let token = '';
    let adminRoleId = '';
    const signInPath = '/users/sessions';

    beforeEach(async () => {
      ({ id: adminRoleId } = await factory.create('role', rolesTestData.adminRole));
      await factory.create('user', { ...usersTestData.user, roleId: adminRoleId });

      ({
        body: { token }
      } = await supertest(app)
        .post(signInPath)
        .set(...defaultHeaders)
        .send(usersTestData.signInRequestBody));
    });

    describe('Should work correctly when the user already exists', () => {
      beforeEach(async () => {
        ({ status, body } = await supertest(app)
          .post(adminUsersPath)
          .set(...defaultHeaders)
          .set('authorization', token)
          .send(usersTestData.createUserRequestBody));
      });

      test('Should return a success status code', () => {
        expect(status).toBe(200);
      });
      test('Should return the created user info without password', () => {
        const userInfo = _.omit(body, [...timeStamps, 'id']);

        expect(userInfo).toMatchObject({
          ...usersTestData.expectedUserInfo,
          role_id: adminRoleId
        });
      });
      test('Should save the user with the correct information', async () => {
        const { id } = body;

        const foundUser = await dbHelper.findUserById(id);
        const cleanedFoundUser = _.omit(foundUser, [...timeStamps, 'password']);

        expect(cleanedFoundUser).toStrictEqual({
          id,
          ...usersTestData.expectedUserInfo,
          role_id: adminRoleId
        });
      });
    });

    describe('Should work correctly when the user does not exist', () => {
      const newAdminEmail = 'newAdmin@wolox.com';

      beforeEach(async () => {
        ({ status, body } = await supertest(app)
          .post(adminUsersPath)
          .set(...defaultHeaders)
          .set('authorization', token)
          .send({ ...usersTestData.createUserRequestBody, email: newAdminEmail }));
      });

      test('Should return a success status code', () => {
        expect(status).toBe(200);
      });
      test('Should return the created user info without password', () => {
        const userInfo = _.omit(body, [...timeStamps, 'id']);
        expect(userInfo).toMatchObject({
          ...usersTestData.expectedUserInfo,
          role_id: adminRoleId,
          email: newAdminEmail
        });
      });
      test('Should save the user with the correct information', async () => {
        const { id } = body;

        const foundUser = await dbHelper.findUserById(id);
        const cleanedFoundUser = _.omit(foundUser, [...timeStamps, 'password']);

        expect(cleanedFoundUser).toStrictEqual({
          id,
          ...usersTestData.expectedUserInfo,
          email: newAdminEmail,
          role_id: adminRoleId
        });
      });
    });

    describe('Should fail correctly with schema error cases', () => {
      afterEach(() => expect(status).toBe(schemaErrorStatus));

      test('Should return the correct error when the provided password length is lower than 8', async () => {
        const shortPassword = '1234';

        ({ status, body } = await supertest(app)
          .post(adminUsersPath)
          .set(...defaultHeaders)
          .set('authorization', token)
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
          .post(adminUsersPath)
          .set(...defaultHeaders)
          .set('authorization', token)
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
            .post(adminUsersPath)
            .set(...defaultHeaders)
            .set('authorization', token)
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
    });
  });
});
