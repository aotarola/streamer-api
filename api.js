'use strict';

const Hapi = require('@hapi/hapi');
const { REDIS_HOST, REDIS_PORT, URLS_SET_NAME } = require('./lib/config')();
const asyncRedis = require('async-redis');

const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retry_strategy: /* istanbul ignore next */ () => 1000,
});

const pub = redisClient.duplicate();

const init = async () => {
  const server = Hapi.server({ port: 3000, host: 'localhost' });

  server.route({
    method: 'POST',
    path: '/stream-url',
    handler: async (request, h) => {
      request.logger.info('In handler %s', request.path);
      await redisClient.sadd(URLS_SET_NAME, request.payload.url);
      await pub.publish('insert', 'message');
      return h.response('').code(201);
    },
  });

  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: process.env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization'],
    },
  });

  await server.start();
  // eslint-disable-next-line no-console
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.error(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

init();
