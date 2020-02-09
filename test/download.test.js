'use strict';

const assert = require('assertive');
//move to before in mocha
process.env.DOWNLOAD_PATH = '/tmp';
const download = require('../lib/download');
const nock = require('nock');
const mockFs = require('mock-fs');
const { promises: fs } = require('fs');

const STUB_FILENAME = 'interesting-file.txt';

describe('download', () => {
  before(() => {
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
  it('downloads a file', async () => {
    await download(new URL('http://test-domain.com/interesting-file.txt'));
    const fileContent = await fs.readFile(
      `${process.env.DOWNLOAD_PATH}/${STUB_FILENAME}`,
      'utf-8'
    );
    assert.equal('Interesting Content', fileContent);
  });
});
