'use strict';

const Joi = require('@hapi/joi');

const { URLS_SET_NAME } = require('../../config');

module.exports = (redisClient, redisPublisher) => ({
  method: 'POST',
  path: '/stream-url',
  handler: async (request, toolkit) => {
    await redisClient.sadd(URLS_SET_NAME, request.payload.url);
    await redisPublisher.publish('insert', 'message');
    return toolkit.response('').code(201);
  },
  options: {
    auth: 'jwt',
    cors: true,
    validate: {
      payload: Joi.object({
        url: Joi.string().required(),
      }),
    },
  },
});
