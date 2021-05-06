const { healthCheck } = require('./controllers/healthCheck');
const { createUserSchema } = require('./middlewares/validationSchemas/users');
const { validateSchema } = require('./middlewares/schemas');
const usersController = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', validateSchema(createUserSchema), usersController.createUser);
};
