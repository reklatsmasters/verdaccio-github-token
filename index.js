const got = require('got');
const LRU = require('lru-cache');

const API_URL = `https://api.github.com/`;
const USER_API = `user`;

class Login {
  constructor(config, stuff) {
    this.config = config;
    this.logger = stuff.logger;
    this.cache = new LRU({
      max: config.max || Infinity,
      maxAge: config.ttl || 60e3
    });
  }

  authenticate(user, password, done) {
    user = user.toLowerCase();

    const orgs = this.cache.get(user);

    if (orgs !== undefined) {
      return process.nextTick(done, null, orgs);
    }

    const onSuccess = groups => {
      this.cache.set(user, groups);
      done(null, groups);
    };
    const onError = err => done(err);

    /* eslint-disable-next-line promise/prefer-await-to-then */
    auth(user, password, this.config).then(onSuccess, onError);
  }
}

async function auth(user, password, config) {
  const options = {
    auth: `${user}:${password}`,
    json: true,
    timeout: config.httpTimeout || 10e3,
    retries: config.httpRetries || 2
  };

  let auth_api = `${API_URL}${USER_API}`;
  const res = await got.get(auth_api, options);
  const {login} = res.body; // eslint-disable-line camelcase

  if (login.toLowerCase() !== user) {
    throw new Error('Invalid user');
  }

  let organisation = config.org;
  let organizations_url = `${API_URL}orgs/${organisation}/members/${user}`;
  const res2 = await got.get(organizations_url, options);

  if (res2.statusCode != 204) {
    throw new Error(`User ${user} is not a member of ${config.org}. Error ${res2.body}`);
  }

  return [config.org];
}

module.exports = (...args) => new Login(...args);
