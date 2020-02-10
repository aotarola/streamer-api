'use strict';

const assert = require('assertive');
const redis = require('redis-mock');
const { promisify } = require('util');

const sinon = require('sinon');

const client = redis.createClient();
const asyncRedis = require('async-redis');
const mockFs = require('mock-fs');

const asyncRedisClient = asyncRedis.decorate(client);

const redisPublisher = asyncRedisClient.duplicate();

const sleep = promisify(setTimeout);

describe('main', () => {
  let stubDownload, stubRedisClient;
  before(() => {
    //FIXME: refactor this so it doesn't need to be set up
    // before requiring the main module
    process.env.DOWNLOAD_PATH = '/tmp';
    stubRedisClient = sinon
      .stub(asyncRedis, 'createClient')
      .returns(asyncRedisClient);
    stubDownload = sinon
      .stub(require('../lib/download'), 'download')
      .returns(Promise.resolve());

    require('../main');
  });

  after(() => {
    mockFs.restore();
    stubDownload.restore();
    stubRedisClient.restore();
    process.env.DOWNLOAD_PATH = undefined;
  });

  it('should create a single key in the set', async () => {
    await asyncRedisClient.hset('urls', 'myKey', 'http://anyurl');
    const keys = await asyncRedisClient.hkeys('urls');
    assert.equal(1, keys.length);
  });

  it('should remove the key after publishing message', async () => {
    redisPublisher.publish('insert');
    await sleep(100);
    const keys = await asyncRedisClient.hkeys('urls');
    assert.equal(0, keys.length);
  });
});
