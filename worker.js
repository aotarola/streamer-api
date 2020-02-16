'use strict';

const config = require('./lib/config');
const { httpStreamToSFTP } = require('./lib/stream-to');
const pMap = require('p-map');
/* istanbul ignore next */
const logger = require('pino')({
  level: parseInt(process.env.LOG_LEVEL || '10'),
});
const asyncRedis = require('async-redis');

const CONCURRENCY = 2;

const {
  REDIS_HOST,
  REDIS_PORT,
  SFTP_HOST,
  SFTP_USER,
  SFTP_PASSWORD,
  SFTP_PORT,
  REMOTE_PATH,
  URLS_SET_NAME,
} = config;

const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retry_strategy: /* istanbul ignore next */ () => 1000,
});

const sub = redisClient.duplicate();

async function downloadFilesPerUrl(url) {
  try {
    logger.info(`downloading ${url}`);
    await httpStreamToSFTP(new URL(url), {
      remotePath: REMOTE_PATH,
      host: SFTP_HOST,
      port: SFTP_PORT,
      user: SFTP_USER,
      password: SFTP_PASSWORD,
    });
    await redisClient.srem(URLS_SET_NAME, url);
  } catch (error) {
    logger.error(
      error,
      `an exception ocurred when trying to operate on ${url}`
    );
  }
}

sub.on('message', async () => {
  const urls = await redisClient.smembers(URLS_SET_NAME);
  await pMap(urls, downloadFilesPerUrl, { concurrency: CONCURRENCY });
});

sub.subscribe('insert');

logger.info(`running on ${REDIS_HOST}: ${REDIS_PORT}`);
