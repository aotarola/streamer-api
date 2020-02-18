'use strict';

const Hapi = require('@hapi/hapi');
const devnull = require('dev-null');
const config = require('./config');
const Joi = require('@hapi/joi');

const {
  URLS_SET_NAME,
  SERVER_HOST,
  SERVER_PORT,
  JWT_SECRET,
  JWT_AUTH_TOKEN,
} = config;

const { getRedisClient } = require('./resources');

const redisClient = getRedisClient();

const pub = redisClient.duplicate();

const server = Hapi.server({
  host: SERVER_HOST,
  port: SERVER_PORT,
});

/* istanbul ignore next */
process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.error(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

module.exports = {
  /* istanbul ignore next */
  async start(start) {
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
      validate: async ({ token }) => {
        return {
          isValid: token === JWT_AUTH_TOKEN,
        };
      },
      verifyOptions: { algorithms: ['HS256'] },
    });

    server.route({
      method: 'POST',
      path: '/stream-url',
      handler: async (request, toolkit) => {
        await redisClient.sadd(URLS_SET_NAME, request.payload.url);
        await pub.publish('insert', 'message');
        return toolkit.response('').code(201);
      },
      options: {
        auth: 'jwt',
        validate: {
          payload: Joi.object({
            url: Joi.string().required(),
          }),
        },
      },
    });

    if (start) {
      await server.start();

      // eslint-disable-next-line no-console
      console.log(`Server running at: ${server.info.uri}`);
    } else {
      await server.initialize();
    }

    return server;
  },
};
