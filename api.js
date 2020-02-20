'use strict';

require('honeybadger').configure({
  apiKey: process.env.HONEYBADGER_API_KEY,
});

require('./lib/api').start(true);
