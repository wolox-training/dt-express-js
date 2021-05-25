const supertest = require('supertest');
const { factory } = require('factory-girl');

const usersTestData = require('../../data/users');
const rolesTestData = require('../../data/roles');
const app = require('../../../app');

describe('Invalidate sessions POST /users/sessions/invalidate_all', () => {
  const signInPath = '/users/sessions';
  const invalidateSessionsPath = `${signInPath}/invalidate_all`;
  let regRoleId = 0;
  let token = '';
  let status = 0;
  let body = {};

  beforeEach(async () => {
    ({ id: regRoleId } = await factory.create('role', rolesTestData.regRole));
    await factory.create('user', { ...usersTestData.user, roleId: regRoleId });
    ({
      body: { token }
    } = await supertest(app)
      .post(signInPath)
      .send(usersTestData.signInRequestBody));

    ({ status } = await supertest(app)
      .post(invalidateSessionsPath)
      .set('authorization', token));
  });

  test('Should return a success status', () => {
    expect(status).toBe(200);
  });

  describe('Should not allow authentication with expired tokens', () => {
    beforeEach(async () => {
      ({ status, body } = await supertest(app)
        .post(invalidateSessionsPath)
        .set('authorization', token));
    });

    test('Should return an unauthorized status', () => {
      expect(status).toBe(401);
    });

    test('Should return the correct error', () => {
      expect(body).toStrictEqual({
        internal_code: 'unauthorized',
        message: 'This token already expired'
      });
    });
  });
});
