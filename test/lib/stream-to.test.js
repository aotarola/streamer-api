'use strict';

const assert = require('assertive');

const nock = require('nock');
const mockFs = require('mock-fs');
const { promises: fs } = require('fs');
const sinon = require('sinon');
const SFTPClient = require('ssh2-sftp-client');
const streamTo = require('../../lib/stream-to');

const STUB_FILENAME = 'interesting-file.txt';
const STUB_BASE_PATH = 'http://test-domain.com';
const STUB_URL = `${STUB_BASE_PATH}/${STUB_FILENAME}`;
const STUB_CONTENT = 'Interesting Content';

describe('httpStreamTo', () => {
  describe('httpStreamToFS', () => {
    before(() => {
      nock(STUB_BASE_PATH)
        .get(`/${STUB_FILENAME}`)
        .reply(200, STUB_CONTENT);

      mockFs({
        '/tmp': {
          /* empty directory*/
        },
      });
    });

    after(() => {
      mockFs.restore();
      nock.restore();
    });

    it('should stream a file from http to file system', async () => {
      const localPath = '/tmp';
      await streamTo.httpStreamToFS(new URL(STUB_URL), { localPath });
      const fileContent = await fs.readFile(
        `${localPath}/${STUB_FILENAME}`,
        'utf-8'
      );
      assert.equal(STUB_CONTENT, fileContent);
    });
  });

  describe('httpStreamToSFTP', () => {
    let stubConnect, stubPut, stubEnd;
    before(() => {
      nock(STUB_BASE_PATH)
        .get(`/${STUB_FILENAME}`)
        .reply(200, STUB_CONTENT);

      stubConnect = sinon.stub(SFTPClient.prototype, 'connect').resolves();
      stubPut = sinon.stub(SFTPClient.prototype, 'put').resolves();
      stubEnd = sinon.stub(SFTPClient.prototype, 'end').resolves();
    });

    after(() => {
      nock.restore();
      stubConnect.restore();
      stubPut.restore();
      stubEnd.restore();
    });

    it('should stream a file from http to sftp', async () => {
      const remotePath = '/tmp';
      await streamTo.httpStreamToSFTP(new URL(STUB_URL), { remotePath });
    });
  });
});
