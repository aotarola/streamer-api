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
      await redisClient.sadd(URLS_SET_NAME, request.payload.url);
      await pub.publish('insert', 'message');
      return h.response('').code(201);
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
