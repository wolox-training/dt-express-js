const { healthCheck } = require('./controllers/healthCheck');
const { validateSchema } = require('./middlewares/schemas');
const { authUser } = require('./middlewares/authentication');
const usersController = require('./controllers/users');
const weetsController = require('./controllers/weets');
const { paginationQuerySchema } = require('./middlewares/validationSchemas/pagination');
const {
  createUserSchema,
  signInSchema,
  upsertAdminSchema
} = require('./middlewares/validationSchemas/users');
const {
  roles: {
    codes: { admin, reg }
  }
} = require('./constants');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', validateSchema(createUserSchema), usersController.createUser);
  app.post('/users/sessions', validateSchema(signInSchema), usersController.signIn);
  app.get('/users', authUser(), validateSchema(paginationQuerySchema), usersController.getUsers);
  app.post('/admin/users', authUser([admin]), validateSchema(upsertAdminSchema), usersController.upsertAdmin);
  app.post('/weets', authUser([reg]), weetsController.createWeet);
};
