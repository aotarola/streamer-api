'use strict';

const JWT = require('jsonwebtoken');

function createToken() {
  return JWT.sign(
    { token: process.env.JWT_AUTH_TOKEN },
    process.env.JWT_SECRET
  );
}

// eslint-disable-next-line no-console
console.log(createToken());
