'use strict';

require('@sentry/node').init({ dsn: process.env.SENTRY_DSN });

require('./lib/api').start(true);
