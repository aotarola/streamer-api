'use strict';

const asyncRedis = require('async-redis');

const { REDIS_HOST, REDIS_PORT, REDIS_URL } = require('./config');

module.exports = {
  getRedisClient() {
    return asyncRedis.createClient({
      host: REDIS_HOST,
      port: REDIS_PORT,
      url: REDIS_URL,
      retry_strategy: /* istanbul ignore next */ () => 1000,
    });
  },
};
