'use strict';

const devnull = require('dev-null');

const { JWT_SECRET, JWT_AUTH_TOKEN } = require('../config');

const { getRedisClient } = require('../resources');

const redisClient = getRedisClient();

const redisPublisher = redisClient.duplicate();

const streamUrl = require('./endpoints/stream-url');

module.exports = async server => {
  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization'],
      logRequestStart: true,
      stream: process.env.LOG_LEVEL === '60' ? devnull() : process.stdout,
    },
  });

  await server.register(require('hapi-auth-jwt2'));

  await server.register({
    plugin: require('hapi-alive'),
  });

  server.auth.strategy('jwt', 'jwt', {
    key: JWT_SECRET,
    validate: async ({ token }) => ({ isValid: token === JWT_AUTH_TOKEN }),
    verifyOptions: { algorithms: ['HS256'] },
  });

  // TODO: iterate over the endpoints directory and build an array of objects
  server.route(streamUrl(redisClient, redisPublisher));
};
