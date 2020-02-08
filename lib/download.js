'use strict';

const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const got = require('got');
const { DOWNLOAD_PATH } = require('./keys');

const pipeline = promisify(stream.pipeline);

module.exports = url =>
  pipeline(got.stream(url), fs.createWriteStream(`${DOWNLOAD_PATH}/file`));
