const { IgApiClient } = require('instagram-private-api');
const igAuth = require('./auth');
const likeFeed = require('./likeFeed');
const { log, delay } = require('./utils');

const start = async () => {
  const ig = new IgApiClient();
  const auth = await igAuth(ig);

  const loop = () =>
    likeFeed(ig, auth)
      .then(log.likes)
      .catch(console.log)
      .then(delay(1))
      .then(loop);

  loop();
};

start().catch(console.log);
