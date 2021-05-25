const supertest = require('supertest');
const { factory } = require('factory-girl');
const _ = require('lodash');

const rolesTestData = require('../../data/roles');
const usersTestData = require('../../data/users');
const weetsTestData = require('../../data/weets');
const app = require('../../../app');
const { errorMessages } = require('../../../app/constants');

const defaultHeaders = ['Accept', 'application/json'];
const schemaErrorStatus = 422;

describe('Ratings test', () => {
  const weetsPath = '/weets';
  const signInPath = '/users/sessions';
  const timeStamps = ['created_at', 'updated_at'];
  let body = {};
  let status = 0;
  let token = '';
  let regRoleId = 0;
  let userId = 0;
  let weetId = 0;

  describe('Create ratings POST /weets/{weetId}/ratings', () => {
    const ratingInfo = { rating: true };

    beforeEach(async () => {
      ({ id: regRoleId } = await factory.create('role', rolesTestData.regRole));
      ({ id: userId } = await factory.create('user', { ...usersTestData.user, roleId: regRoleId }));
      ({ id: weetId } = await factory.create('weet', { ...weetsTestData.weet, userId }));
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
          .post(`${weetsPath}/${weetId}/ratings`)
          .set(...defaultHeaders)
          .set('authorization', token)
          .send(ratingInfo));
      });

      test('Should return a created status', () => {
        expect(status).toBe(201);
      });

      test('Should return the created rating info', () => {
        const cleanedRating = _.omit(body, [...timeStamps, 'id']);
        const { rating } = ratingInfo;

        expect(cleanedRating).toStrictEqual({
          user_id: userId,
          weet_id: weetId,
          rating
        });
      });
    });

    describe('Should fail correctly when the provided weet is not found', () => {
      const notFoundWeetId = 12321;

      beforeEach(async () => {
        ({ body, status } = await supertest(app)
          .post(`${weetsPath}/${notFoundWeetId}/ratings`)
          .set(...defaultHeaders)
          .set('authorization', token)
          .send(ratingInfo));
      });

      test('Should return a schema error status', () => {
        expect(status).toBe(schemaErrorStatus);
      });

      test('Should return the correct error', () => {
        expect(body).toStrictEqual(
          usersTestData.getSchemaErrorResponse([
            {
              location: 'params',
              msg: errorMessages.notFound,
              param: 'weetId',
              value: notFoundWeetId
            }
          ])
        );
      });
    });
  });
});
