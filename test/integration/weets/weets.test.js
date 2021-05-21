const supertest = require('supertest');
const { factory } = require('factory-girl');
const axios = require('axios');
const _ = require('lodash');

const rolesTestData = require('../../data/roles');
const usersTestData = require('../../data/users');
const weetsTestData = require('../../data/weets');
const app = require('../../../app');

jest.mock('axios');

const defaultHeaders = ['Accept', 'application/json'];
const timeStamps = ['created_at', 'updated_at'];

describe('Weets test', () => {
  let body = {};
  let status = 0;

  describe('Creates weets', () => {
    let token = '';
    let regRoleId = 0;
    let userId = 0;
    const signInPath = '/users/sessions';
    const weetsPath = '/weets';

    describe('Create weets POST  /weets', () => {
      beforeEach(async () => {
        axios.get.mockImplementation(() =>
          Promise.resolve({ status: 200, data: { joke: weetsTestData.joke } })
        );
        ({ id: regRoleId } = await factory.create('role', rolesTestData.regRole));
        ({ id: userId } = await factory.create('user', { ...usersTestData.user, roleId: regRoleId }));
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
            .post(weetsPath)
            .set(...defaultHeaders)
            .set('authorization', token));
        });

        test('Should return a created status code', () => {
          expect(status).toBe(201);
        });

        test('Should return the created weet info', () => {
          const { id: weetId } = body;
          const cleanedWeetInfo = _.omit(body, timeStamps);
          const expectedCreatedWeet = {
            ...weetsTestData.expectedCreatedWeet,
            id: weetId,
            user_id: userId
          };
          expect(cleanedWeetInfo).toStrictEqual(expectedCreatedWeet);
        });
      });
    });

    describe('Should throw the correct error if the user is not authenticated', () => {
      beforeEach(async () => {
        ({ body, status } = await supertest(app)
          .post(weetsPath)
          .set(...defaultHeaders));
      });

      test('Should return an unauthorized status', () => {
        expect(status).toBe(401);
      });

      test('Should return the correct error', () => {
        expect(body).toStrictEqual({ internal_code: 'unauthorized', message: 'Unauthorized' });
      });
    });

    describe('Should throw the correct error if the user is not regular', () => {
      let adminRoleId = 0;

      beforeEach(async () => {
        ({ id: adminRoleId } = await factory.create('role', rolesTestData.adminRole));
        await factory.create('user', { ...usersTestData.user, roleId: adminRoleId });
        ({
          body: { token }
        } = await supertest(app)
          .post(signInPath)
          .set(...defaultHeaders)
          .send(usersTestData.signInRequestBody));

        ({ body, status } = await supertest(app)
          .post(weetsPath)
          .set(...defaultHeaders)
          .set('authorization', token));
      });

      test('Should return a forbidden status', () => {
        expect(status).toBe(403);
      });

      test('Should return the correct error', () => {
        expect(body).toStrictEqual({
          internal_code: 'forbidden',
          message: "User doesn't have permissions to execute this action"
        });
      });
    });
  });
});
