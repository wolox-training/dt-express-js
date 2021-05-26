const { factory } = require('factory-girl');

const emailHelper = require('../../../app/helpers/email');
const usersService = require('../../../app/services/users');
const usersTestData = require('../../data/users');
const rolesTestData = require('../../data/roles');

jest.mock('../../../app/helpers/email');

describe('Send congratulations emails', () => {
  beforeEach(async () => {
    emailHelper.sendMail.mockImplementation(() => Promise.resolve());
    const { id: roleId } = await factory.create('role', rolesTestData.regRole);
    await factory.createMany(
      'user',
      usersTestData.users.length,
      usersTestData.users.map(user => ({ ...user, roleId }))
    );
  });

  test('Should send the email to all existing users at once', async () => {
    await usersService.sendCongratulationsEmails();

    expect(emailHelper.sendMail).toBeCalledTimes(1);
  });

  test('Should send the email to all existing users', async () => {
    await usersService.sendCongratulationsEmails();
    const existingUserEmails = usersTestData.users.map(({ email }) => email);
    const [[emailsParam]] = emailHelper.sendMail.mock.calls;

    expect(emailsParam).toEqual(existingUserEmails);
  });
});
