'use strict';

const config = require('./config');
const controllers = require('./controllers');
const routes = require('./routes');
const services = require('./services');
const register = require('./register');

module.exports = {
  config,
  controllers,
  routes,
  services,
  register,
};
