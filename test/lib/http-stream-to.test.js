'use strict';

const assert = require('assertive');

const nock = require('nock');
const mockFs = require('mock-fs');
const { promises: fs } = require('fs');

const { httpStreamToFS } = require('../../lib/http-stream-to');

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

    it('should download a file', async () => {
      const localPath = '/tmp';
      await httpStreamToFS(new URL(STUB_URL), { localPath });
      const fileContent = await fs.readFile(
        `${localPath}/${STUB_FILENAME}`,
        'utf-8'
      );
      assert.equal(STUB_CONTENT, fileContent);
    });
  });
});
