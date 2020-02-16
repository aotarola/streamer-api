'use strict';

const assert = require('assertive');
const sinon = require('sinon');

const asyncRedis = require('async-redis');

describe('POST /stream-url', () => {
  let server;

  before(() => {
    sinon.stub(asyncRedis, 'createClient').returns({
      duplicate() {
        return { publish() { } };
      },
      sadd() { },
    });

    server = require('../api');
  });

  after(() => {
    sinon.restore();
  });

  beforeEach(async () => {
    server = await server.start(false);
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with 201', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/stream-url',
      payload: { url: 'any url' },
    });
    assert.equal(201, res.statusCode);
  });
});
