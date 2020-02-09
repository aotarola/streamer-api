'use strict';

const asyncRedis = require('async-redis');
const main = require('./main');

main.run(asyncRedis);
