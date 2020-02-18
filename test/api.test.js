'use strict';

const assert = require('assertive');
const sinon = require('sinon');

const asyncRedis = require('async-redis');
const createToken = require('../scripts/create-token');

sinon.stub(asyncRedis, 'createClient').returns({
  duplicate() {
    return {
      publish() {
        return sinon.stub();
      },
    };
  },
  sadd() {
    return sinon.stub();
  },
});

const api = require('../lib/api');

describe('POST /stream-url', () => {
  let server;

  const headers = {
    authorization: createToken(),
  };

  before(async () => {
    server = await api.start(false);
  });

  after(async () => {
    sinon.restore();
    await server.stop();
  });

  describe('POST /stream-url', () => {
    describe('201 status code', () => {
      it('should succeed', async () => {
        const res = await server.inject({
          method: 'post',
          url: '/stream-url',
          payload: { url: 'any url' },
          headers,
        });
        assert.equal(201, res.statusCode);
      });
    });

    describe('401 status code', () => {
      it('should fail when no JWT token is passed', async () => {
        const res = await server.inject({
          method: 'post',
          url: '/stream-url',
          payload: { url: 'any url' },
        });
        assert.equal(401, res.statusCode);
      });
    });

    describe('400 status code', () => {
      it('should fail for empty string in url key', async () => {
        const res = await server.inject({
          method: 'post',
          url: '/stream-url',
          payload: { url: '' },
          headers,
        });
        assert.equal(400, res.statusCode);
      });

      it('should fail when no payload is passed', async () => {
        const res = await server.inject({
          method: 'post',
          url: '/stream-url',
          headers,
        });
        assert.equal(400, res.statusCode);
      });
    });
  });
});
