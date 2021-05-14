const { healthCheck } = require('./controllers/healthCheck');
const { createUserSchema, signInSchema, getUsersSchema } = require('./middlewares/validationSchemas/users');
const { validateSchema } = require('./middlewares/schemas');
const { authUser } = require('./middlewares/authentication');
const usersController = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', validateSchema(createUserSchema), usersController.createUser);
  app.post('/users/sessions', validateSchema(signInSchema), usersController.signIn);
  app.get('/users', authUser, validateSchema(getUsersSchema), usersController.getUsers);
};
