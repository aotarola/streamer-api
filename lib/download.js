'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const config = require('./config');
const path = require('path');

const pipeline = promisify(stream.pipeline);

module.exports = {
  download(url) {
    const { DOWNLOAD_PATH } = config();
    const filename = url.pathname.split('/').pop();
    return pipeline(
      got.stream(url),
      fs.createWriteStream(path.join(DOWNLOAD_PATH, filename))
    );
  },
};
