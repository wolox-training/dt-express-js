const { userFirstName, userLastName, userPassword, userEmail } = require('../schemas');

const requiredInBody = {
  in: 'body',
  required: true
};

module.exports = {
  createUser: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            first_name: { ...userFirstName, ...requiredInBody },
            last_name: { ...userLastName, ...requiredInBody },
            password: { ...userPassword, ...requiredInBody },
            email: { ...userEmail, ...requiredInBody }
          }
        }
      }
    },
    required: true
  },
  signInUser: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            password: { ...userPassword, ...requiredInBody },
            email: { ...userEmail, ...requiredInBody }
          }
        }
      }
    },
    required: true
  }
};
