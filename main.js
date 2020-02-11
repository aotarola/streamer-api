'use strict';

// TODO:
// - CD

const config = require('./lib/config');
const { download } = require('./lib/download');
const pMap = require('p-map');
const logger = require('pino')({
  level: parseInt(process.env.LOG_LEVEL || '10'),
});
const asyncRedis = require('async-redis');

const CONCURRENCY = 2;

const { REDIS_HOST, REDIS_PORT } = config();
const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retry_strategy: /* istanbul ignore next */ () => 1000,
});

const sub = redisClient.duplicate();

async function downloadFilesPerUrl(url) {
  try {
    await download(new URL(url));
    await redisClient.srem('urls', url);
    logger.info(`Downloaded ${url}`);
  } catch (error) {
    logger.error(error, 'downloadFilesPerKey');
  }
}

sub.on('message', async () => {
  const urls = await redisClient.smembers('urls');
  logger.info(urls, 'Current urls');
  await pMap(urls, downloadFilesPerUrl, { concurrency: CONCURRENCY });
});

sub.subscribe('insert');

logger.info(`running on ${REDIS_HOST}: ${REDIS_PORT}`);
