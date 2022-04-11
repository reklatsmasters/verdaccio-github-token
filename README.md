# verdaccio-github-token

- This is an extension of [verdaccio-github-token](https://github.com/reklatsmasters/verdaccio-github-token/)
  which needs organisation membership to be public.
- The extended package does not need your organisation membership to be public and works with private membership for `unhaggle`.
- Uses Github [personal access tokens](https://github.com/settings/tokens) as password for authentication.

## Install

```sh
npm install verdaccio verdaccio-github-token@2.0.0 --registry https://npm.motoinsight.com
```

## Usage

Use your [personal access token](https://github.com/settings/tokens) as password and github username as login.

## Config

```yml
auth:
  github-token:
    org: unhaggle
```

* `org: string, required`

People within this org will be able to auth (public/private membership, both work)

* `ttl: number, default=60e3`

Cache time in ms. See [lru-cache#maxAge](https://www.npmjs.com/package/lru-cache).

* `max: number, default=Infinity`

See [lru-cache#max](https://www.npmjs.com/package/lru-cache).

* `httpTimeout: number, default=10e3`

See [got#timeout](https://www.npmjs.com/package/got#timeout).

* `httpRetries: number, default=2`

See [got#retries](https://www.npmjs.com/package/got#retries).


## Publish package

```
npm install
npm build
npm login --registry=https://npm.motoinsight.com
npm publish --registry=https://npm.motoinsight.com .
```

## License

MIT, 2018 (c) Dmitriy Tsvettsikh
