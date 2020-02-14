'use strict';

module.exports = () => ({
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SFTP_HOST: process.env.SSH_HOST,
  SFTP_USER: process.env.SSH_USER,
  SFTP_PASSWORD: process.env.SSH_PASSWORD,
  SFTP_PORT: process.env.SFTP_PORT || 22,
  DOWNLOAD_PATH: process.env.DOWNLOAD_PATH,
  MODE: process.env.MODE || '0',
});
