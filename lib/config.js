'use strict';

module.exports = () => ({
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SSH_HOST: process.env.SSH_HOST,
  SSH_USER: process.env.SSH_USER,
  SSH_PASSWORD: process.env.SSH_PASSWORD,
  DOWNLOAD_PATH: process.env.DOWNLOAD_PATH,
  MODE: process.env.MODE || '0',
});
