'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const { DOWNLOAD_PATH } = require('./keys');

const pipeline = promisify(stream.pipeline);

module.exports = {
  download(url) {
    const filename = url.pathname.split('/').pop();
    return pipeline(
      got.stream(url),
      fs.createWriteStream(`${DOWNLOAD_PATH}/${filename}`)
    );
  },
};
