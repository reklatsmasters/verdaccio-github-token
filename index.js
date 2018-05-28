const got = require('got');
const LRU = require('lru-cache');

const API_URL = `https://api.github.com/user`;

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

  const res = await got.get(API_URL, options);
  const {login, organizations_url} = res.body; // eslint-disable-line camelcase

  if (login.toLowerCase() !== user) {
    throw new Error('Invalid user');
  }

  const res2 = await got.get(organizations_url, options);
  const orgs = res2.body.map(org => org.login);

  if (!orgs.some(org => org === config.org)) {
    throw new Error(`User ${user} is not a member of ${config.org}`);
  }

  return orgs;
}

module.exports = (...args) => new Login(...args);
