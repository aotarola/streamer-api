'use strict';

const Hapi = require('@hapi/hapi');
const devnull = require('dev-null');
const config = require('./lib/config');
const Joi = require('@hapi/joi');

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_URL,
  URLS_SET_NAME,
  SERVER_HOST,
  SERVER_PORT,
} = config;

const asyncRedis = require('async-redis');

const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  url: REDIS_URL,
  retry_strategy: /* istanbul ignore next */ () => 1000,
});

const pub = redisClient.duplicate();

const server = Hapi.server({
  host: SERVER_HOST,
  port: SERVER_PORT,
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
    validate: {
      payload: Joi.object({
        url: Joi.string().required(),
      }),
    },
  },
});

server.route({
  method: 'GET',
  path: '/healthcheck',
  handler: () => '',
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
