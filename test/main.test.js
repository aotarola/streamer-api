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
    process.env.DOWNLOAD_PATH = '/tmp';

    stubRedisClient = sinon
      .stub(asyncRedis, 'createClient')
      .returns(asyncRedisClient);

    stubDownload = sinon.stub(require('../lib/download'), 'download');
    stubDownload.onCall(0).returns(Promise.resolve());
    stubDownload.onCall(1).rejects();

    // run the app
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

  it('should noop when failing to download a file', async () => {
    await asyncRedisClient.hset('urls', 'myKey', 'http://anyurl');
    redisPublisher.publish('insert');
    await sleep(100);
    const keys = await asyncRedisClient.hkeys('urls');
    // fails silently to remove the key
    assert.equal(1, keys.length);
  });
});
