# streamer API

[![CircleCI](https://circleci.com/gh/aotarola/streamer-api.svg?style=shield)](https://circleci.com/gh/aotarola/streamer-api)
[![codecov](https://codecov.io/gh/aotarola/streamer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/aotarola/streamer-api)

A simple API that offloads the task to stream a file to a SFTP server.

## Installation

```zsh
npm i
```

## Usage

### For local development

```zsh
npm run dev
```

To configure the app, you'll have to set the following environment variables:

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
