'use strict';

const assert = require('assertive');

const nock = require('nock');
const mockFs = require('mock-fs');
const { promises: fs } = require('fs');

const STUB_FILENAME = 'interesting-file.txt';
const STUB_BASE_PATH = 'http://test-domain.com';
const STUB_URL = `${STUB_BASE_PATH}/${STUB_FILENAME}`;
const STUB_CONTENT = 'Interesting Content';

let download;

describe('download', () => {
  before(() => {
    process.env.DOWNLOAD_PATH = '/tmp';
    download = require('../../lib/download');

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
  });

  it('should download a file', async () => {
    await download(new URL(STUB_URL));
    const fileContent = await fs.readFile(
      `${process.env.DOWNLOAD_PATH}/${STUB_FILENAME}`,
      'utf-8'
    );
    assert.equal(STUB_CONTENT, fileContent);
  });
});
