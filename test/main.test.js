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

let main;

describe('main', () => {
  let stubDownload;
  before(() => {
    process.env.DOWNLOAD_PATH = '/tmp';

    stubDownload = sinon
      .stub(require('../lib/download'), 'download')
      .returns(Promise.resolve());

    main = require('../main');

    main.run({
      createClient() {
        return asyncRedisClient;
      },
    });
  });

  after(() => {
    mockFs.restore();
    stubDownload.restore();
  });

  it('should do something', async () => {
    await asyncRedisClient.hset('urls', 'myKey', 'http://anyurl');
    redisPublisher.publish('insert');
    await sleep(100);
    const keys = await asyncRedisClient.hkeys('urls');
    assert.equal(0, keys.length);
  });
});
