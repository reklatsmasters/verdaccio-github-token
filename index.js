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
  /**
   * [auth] Authenticate user using two API's, one to check username match with what is supplied and the other to verify organisation membership.
   * @param  {string} user     [github username]
   * @param  {string} password [github personal access token]
   * @param  {object} config   [config object]
   * @return {[list/array]}    [config.org] Array of organisation list which user has access to when the username and password are authenticated from github.
   */
  const options = {
    auth: `${user}:${password}`,
    json: true,
    timeout: config.httpTimeout || 10e3,
    retries: config.httpRetries || 2
  };

  const authApi = `${API_URL}${USER_API}`;
  const res = await got.get(authApi, options);
  const {login} = res.body;

  if (login.toLowerCase() !== user) {
    throw new Error('Invalid user');
  }

  for (const org of config.org.split(',')) {
    const organizationsUrl = `${API_URL}orgs/${org}/members/${user}`;

    /* eslint-disable no-await-in-loop */
    const res2 = await got.get(organizationsUrl, options);

    if (res2.statusCode === 204) {
      return [org];
    }
  }
  throw new Error(`User ${user} is not a member of any of ${config.org}.`);
}

module.exports = (...args) => new Login(...args);
