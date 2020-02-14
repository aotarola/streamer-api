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
  let stubHttpStreamToFS, stubRedisClient;
  before(() => {
    stubRedisClient = sinon
      .stub(asyncRedis, 'createClient')
      .returns(asyncRedisClient);

    stubHttpStreamToFS = sinon.stub(
      require('../lib/stream-to'),
      'httpStreamToSFTP'
    );
    stubHttpStreamToFS.onCall(0).returns(Promise.resolve());
    stubHttpStreamToFS.onCall(1).rejects();

    // run the app
    require('../main');
  });

  after(() => {
    mockFs.restore();
    stubHttpStreamToFS.restore();
    stubRedisClient.restore();
  });

  it('should create a single key in the set', async () => {
    await asyncRedisClient.sadd('urls', 'http://anyurl');
    const keys = await asyncRedisClient.smembers('urls');
    assert.equal(1, keys.length);
  });

  it('should remove the key after publishing message', async () => {
    redisPublisher.publish('insert');
    await sleep(100);
    const urls = await asyncRedisClient.smembers('urls');
    assert.equal(0, urls.length);
  });

  it('should noop when failing to download a file', async () => {
    await asyncRedisClient.sadd('urls', 'http://anyurl');
    redisPublisher.publish('insert');
    await sleep(100);
    const urls = await asyncRedisClient.smembers('urls');
    // fails silently to remove the key
    assert.equal(1, urls.length);
  });
});
