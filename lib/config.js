'use strict';

module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SFTP_HOST: process.env.SFTP_HOST,
  SFTP_USER: process.env.SFTP_USER,
  SFTP_PASSWORD: process.env.SFTP_PASSWORD,
  SFTP_PORT: process.env.SFTP_PORT || 22,
  SERVER_HOST: process.env.SERVER_HOST || '0.0.0.0',
  SERVER_PORT: process.env.SERVER_PORT || process.env.PORT || 3000,
  REMOTE_PATH: process.env.REMOTE_PATH,
  URLS_SET_NAME: 'urls',
};
