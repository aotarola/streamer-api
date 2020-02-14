# redis-worker

[![CircleCI](https://circleci.com/gh/aotarola/redis-worker.svg?style=shield)](https://circleci.com/gh/aotarola/redis-worker)
[![codecov](https://codecov.io/gh/aotarola/redis-worker/branch/master/graph/badge.svg)](https://codecov.io/gh/aotarola/redis-worker)

A simple redis worker that streams a remote file to a specified remote path via SFTP.

## Installation

```zsh
npm i
```

## Usage

### For local development

```zsh
npm run dev
```

To configure the script, you'll have to set the following environment variables:

* `SFTP_HOST`
* `SFTP_USER`
* `SFTP_PASSWORD`
* `REMOTE_PATH`

**NOTE:** For `REMOTE_PATH` you'll have to pass the absolute remote path.

**_ProTip:_** You can store your env variables in a `.env` file, see more in [dotenv][dotenv]

## Running tests

```zsh
npm t
```

## License

MIT

[dotenv]: https://github.com/motdotla/dotenv
