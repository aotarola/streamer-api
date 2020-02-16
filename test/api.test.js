'use strict';

const assert = require('assertive');
const sinon = require('sinon');

const asyncRedis = require('async-redis');

sinon.stub(asyncRedis, 'createClient').returns({
  duplicate() {
    return { publish() { } };
  },
  sadd() { },
});

const api = require('../api');

describe('POST /stream-url', () => {
  let server;

  before(async () => {
    server = await api.start(false);
  });

  after(async () => {
    sinon.restore();
    await server.stop();
  });

  describe('POST /stream-url', () => {
    it('responds with 201', async () => {
      const res = await server.inject({
        method: 'post',
        url: '/stream-url',
        payload: { url: 'any url' },
      });
      assert.equal(201, res.statusCode);
    });
  });

  describe('GET /healthcheck', () => {
    it('responds with 200', async () => {
      const res = await server.inject({
        method: 'get',
        url: '/healthcheck',
      });
      assert.equal(204, res.statusCode);
    });
  });
});
