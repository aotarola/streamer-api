'use strict';

const JWT = require('jsonwebtoken');

console.log(process.env.JWT_AUTH_TOKEN);
console.log(process.env.JWT_SECRET);
const token = JWT.sign(
  { token: process.env.JWT_AUTH_TOKEN },
  process.env.JWT_SECRET
);
// eslint-disable-next-line no-console
console.log(token);
