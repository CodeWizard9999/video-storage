const swaggerJsDoc = require('swagger-jsdoc');

const definitions = require('./definition.json');
const config = require('../config/swagger.config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.apiName,
      version: config.apiVersion,
      description: 'Video service API documentation',
    },
    tags: [
      {
        name: 'Users',
        description: 'The users managing API allows you to create users, get list with all users, finds specific user by id or edit user'
      },
      {
        name: 'Videos',
        description: 'The videos managing API allows you to create video, get list with all videos, finds specific video by id or edit video'
      },
      {
        name: 'Admin',
        description: 'The admin managing API allows you to create users, get list with all users, find specific user by id, edit and delete user'
      },
      {
        name: 'Login',
        description: 'The login managing API implemented for logIn-signIn-logOut'
      }
    ],
    definitions
  },
  // apis: ['./src/*/*.js', './src/*/*.json']
  apis: ['src/*/*.js', 'src/*/*.json']
};

const swaggerSpecs = swaggerJsDoc(options);

module.exports = {
  swaggerSpecs
};
