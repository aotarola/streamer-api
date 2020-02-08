'use strict';

// TODO:
// - mocha tests
// - better org code
// - docker set up
// - CI
// - CD
// - use debug module
// - better logging, maybe use a service?
// - please write a README!
// - use TS on js docs, auto generate typedefs

const asyncRedis = require('async-redis');
const { REDIS_HOST, REDIS_PORT } = require('./keys');

const redisClient = asyncRedis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

async function downloadFile(url) {
  return await `downloading ${url}. done after a while`;
}
// FIXME: limit concurrency!
sub.on('message', async () => {
  const keys = await redisClient.hkeys('urls');
  const asyncKeys = keys.map(async key => {
    try {
      console.log(await downloadFile(await redisClient.hget('urls', key)));
      await redisClient.hdel('urls', key);
    } catch (error) {
      console.log(`An error happened: ${error}`);
    }
  });
  await Promise.all(asyncKeys);
});

sub.subscribe('insert');

console.log(`running on ${REDIS_HOST}:${REDIS_PORT}`);
