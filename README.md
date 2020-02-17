# streamer API

[![CircleCI](https://circleci.com/gh/aotarola/streamer-api.svg?style=shield)](https://circleci.com/gh/aotarola/streamer-api)
[![codecov](https://codecov.io/gh/aotarola/streamer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/aotarola/streamer-api)

A simple API that offloads the task to stream a file to a SFTP server.

## Getting Started

These instructions will get you a working copy of the project, ready for test
and deployment

### Prerequisites

Make sure you have node installed, you can use [`nvm`][nvm] to have multiple
node versions

```
nvm i lts/erbium
```

In development mode the app uses **redis** so be sure to have it installed,
in docker it'd be:
and running.

```
docker run  -p 6379:6379 redis:alpine
```

### Installing

```zsh
npm ci
```

### Running the dev server

To run the api

```zsh
npm run api-dev
```

To run the worker

```zsh
npm run worker-dev
```

To configure the app, you'll have to set the following environment variables:

* `REDIS_HOST`
* `REDIS_PORT`
* `REDIS_URL`
* `SFTP_HOST`
* `SFTP_USER`
* `SFTP_PASSWORD`
* `REMOTE_PATH`
* `JWT_SECRET`
* `JWT_AUTH_TOKEN`

**_ProTip:_** You can store your env variables in a `.env` file, see more in [dotenv][dotenv]

**NOTES:**

You'll most likely use `REDIS_HOST` and `REDIS_PORT` in local development, and
`REDIS_URL` in production, but ultimately it is up to the platform the app is
running

For `REMOTE_PATH` you'll have to pass the absolute remote path.

`JWT_SECRET` refers to the secret key used by JWT to validate the token

`JWT_AUTH_TOKEN` a token used to validate the decoded auth object. The auth
object should have the following shape:

```js
{
  token: 'my-super-token'
}
```

### Running tests

```zsh
npm t
```

## License

MIT

[dotenv]: https://github.com/motdotla/dotenv
[nvm]: https://github.com/nvm-sh/nvm
