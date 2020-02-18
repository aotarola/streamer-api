'use strict';

const Hapi = require('@hapi/hapi');

const { SERVER_HOST, SERVER_PORT } = require('../config');

const configureServer = require('./configure-server');

const server = Hapi.server({
  host: SERVER_HOST,
  port: SERVER_PORT,
});

/* istanbul ignore next */
process.on('unhandledRejection', err => {
  // eslint-disable-next-line no-console
  console.error(err);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

module.exports = {
  /* istanbul ignore next */
  async start(start) {
    await configureServer(server);

    if (start) {
      await server.start();

      // eslint-disable-next-line no-console
      console.log(`Server running at: ${server.info.uri}`);
    } else {
      await server.initialize();
    }

    return server;
  },
};
