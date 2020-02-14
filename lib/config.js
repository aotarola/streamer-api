'use strict';

module.exports = () => ({
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SFTP_HOST: process.env.SFTP_HOST,
  SFTP_USER: process.env.SFTP_USER,
  SFTP_PASSWORD: process.env.SFTP_PASSWORD,
  SFTP_PORT: process.env.SFTP_PORT || 22,
  REMOTE_PATH: process.env.REMOTE_PATH,
  MODE: process.env.MODE || '0',
});
