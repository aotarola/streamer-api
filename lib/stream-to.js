'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const path = require('path');
const SFTPClient = require('ssh2-sftp-client');

const pipeline = promisify(stream.pipeline);

function getFilenameFromURL(url) {
  return url.pathname.split('/').pop();
}

module.exports = {
  httpStreamToSFTP(url, opts = {}) {
    const sftpClient = new SFTPClient();
    const { remotePath } = opts;
    if (!remotePath) {
      throw Error('remotePath must be specified in options');
    }
    const filename = getFilenameFromURL(url);
    return sftpClient
      .connect(opts)
      .then(() =>
        sftpClient.put(got.stream(url), path.join(remotePath, filename))
      )
      .then(() => sftpClient.end());
  },
  httpStreamToFS(url, { localPath } = {}) {
    if (!localPath) {
      throw Error('localPath must be specified in options');
    }
    const filename = getFilenameFromURL(url);
    return pipeline(
      got.stream(url),
      fs.createWriteStream(path.join(localPath, filename))
    );
  },
};
