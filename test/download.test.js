'use strict';

const assert = require('assertive');

const nock = require('nock');
const mockFs = require('mock-fs');
const { promises: fs } = require('fs');

const STUB_FILENAME = 'interesting-file.txt';

let download;

describe('download', () => {
  before(() => {
    process.env.DOWNLOAD_PATH = '/tmp';
    download = require('../lib/download');

    nock('http://test-domain.com')
      .get(`/${STUB_FILENAME}`)
      .reply(200, 'Interesting Content');

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
    await download(new URL('http://test-domain.com/interesting-file.txt'));
    const fileContent = await fs.readFile(
      `${process.env.DOWNLOAD_PATH}/${STUB_FILENAME}`,
      'utf-8'
    );
    assert.equal('Interesting Content', fileContent);
  });
});
