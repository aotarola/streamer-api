'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const path = require('path');

const pipeline = promisify(stream.pipeline);

module.exports = {
  async httpStreamToSFTP(url, opts) {
    const { host, user, password } = opts();
    return pipeline(got.stream(url));
  },
  httpStreamToFS(url, { localPath } = {}) {
    if (!localPath) {
      throw Error('path not specified');
    }
    const filename = url.pathname.split('/').pop();
    return pipeline(
      got.stream(url),
      fs.createWriteStream(path.join(localPath, filename))
    );
  },
};
