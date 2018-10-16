# verdaccio-github-token

[![Build Status](https://travis-ci.com/reklatsmasters/verdaccio-github-token.svg?branch=master)](https://travis-ci.com/reklatsmasters/verdaccio-github-token)
[![npm](https://img.shields.io/npm/v/verdaccio-github-token.svg)](https://npmjs.org/package/verdaccio-github-token)
[![node](https://img.shields.io/node/v/verdaccio-github-token.svg)](https://npmjs.org/package/verdaccio-github-token)
[![license](https://img.shields.io/npm/l/verdaccio-github-token.svg)](https://npmjs.org/package/verdaccio-github-token)
[![downloads](https://img.shields.io/npm/dm/verdaccio-github-token.svg)](https://npmjs.org/package/verdaccio-github-token)

Verdaccio authentication plugin via Github [personal access tokens](https://github.com/settings/tokens).

## Install

```sh
npm i -g verdaccio verdaccio-github-token
```

## Usage

Use your [personal access token](https://github.com/settings/tokens) as password and github username as login. **Note**: You should make your membership in the organization public, see [github api](https://developer.github.com/v3/orgs/#list-user-organizations).

## Config

```yml
auth:
  github-token:
    org: my-loved-company
```

* `org: string, required`

Peoples within this org will be able to auth.

* `ttl: number, default=60e3`

Cache time in ms. See [lru-cache#maxAge](https://www.npmjs.com/package/lru-cache).

* `max: number, default=Infinity`

See [lru-cache#max](https://www.npmjs.com/package/lru-cache).

* `httpTimeout: number, default=10e3`

See [got#timeout](https://www.npmjs.com/package/got#timeout).

* `httpRetries: number, default=2`

See [got#retries](https://www.npmjs.com/package/got#retries).

## License

MIT, 2018 (c) Dmitriy Tsvettsikh
