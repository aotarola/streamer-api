'use strict';

const assert = require('assertive');
const redis = require('redis-mock');
const { promisify } = require('util');
const nock = require('nock');

const client = redis.createClient();
const asyncRedis = require('async-redis');
const mockFs = require('mock-fs');

const asyncRedisClient = asyncRedis.decorate(client);

const redisPublisher = asyncRedisClient.duplicate();

const sleep = promisify(setTimeout);

const STUB_BASE_PATH = 'http://test-domain.com';
const STUB_FILENAME = 'interesting-file.txt';
const STUB_CONTENT = 'Interesting Content';

const STUB_URL = `${STUB_BASE_PATH}/${STUB_FILENAME}`;

let main;

describe('main', () => {
  before(() => {
    process.env.DOWNLOAD_PATH = '/tmp';
    main = require('../main');

    nock(STUB_BASE_PATH)
      .get(`/${STUB_FILENAME}`)
      .reply(200, STUB_CONTENT);

    mockFs({
      '/tmp': {
        /* empty directory*/
      },
    });

    main.run({
      createClient() {
        return asyncRedisClient;
      },
    });
  });

  after(() => {
    mockFs.restore();
  });

  it('should do something', async () => {
    await asyncRedisClient.hset('urls', 'aurl', STUB_URL);
    redisPublisher.publish('insert');
    await sleep(100);
    const keys = await asyncRedisClient.hkeys('urls');
    assert.equal(0, keys.length);
  });
});
