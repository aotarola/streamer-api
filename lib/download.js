'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const config = require('./config');
const path = require('path');

const pipeline = promisify(stream.pipeline);

function downloadToPath(url) {
  const { DOWNLOAD_PATH } = config();
  const filename = url.pathname.split('/').pop();
  return pipeline(
    got.stream(url),
    fs.createWriteStream(path.join(DOWNLOAD_PATH, filename))
  );
}

function downloadToRemote(url) {
  const { SSH_HOST, SSH_USER, SSH_PASSWORD } = config();
  return pipeline(got.stream(url));
}

module.exports = {
  async download(url) {
    const { MODE } = config();
    switch (MODE) {
      case '0':
        return downloadToPath(url);
      case '1':
        return downloadToRemote(url);
      default:
        break;
    }
    return null;
  },
};
