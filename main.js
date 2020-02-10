'use strict';

// TODO:
// - CD

const { REDIS_HOST, REDIS_PORT } = require('./lib/keys');
const { download } = require('./lib/download');
const pMap = require('p-map');
const logger = require('pino')({
  level: parseInt(process.env.LOG_LEVEL || '10'),
});
const asyncRedis = require('async-redis');

const CONCURRENCY = 2;

const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

async function downloadFilesPerKey(key) {
  try {
    const url = await redisClient.hget('urls', key);
    await download(new URL(url));
    await redisClient.hdel('urls', key);
    logger.info(`Downloaded ${url}`);
  } catch (error) {
    logger.error(error, 'downloadFilesPerKey');
  }
}

sub.on('message', async () => {
  const keys = await redisClient.hkeys('urls');
  logger.info(keys, 'Current keys');
  await pMap(keys, downloadFilesPerKey, { concurrency: CONCURRENCY });
});

sub.subscribe('insert');

logger.info(`running on ${REDIS_HOST}: ${REDIS_PORT}`);
