const { IgApiClient } = require('instagram-private-api');
const igAuth = require('./auth');
const likeFeed = require('./likeFeed');
const watchStories = require('./watchStories');
const { log, delay } = require('./utils');

const start = async () => {
  const ig = new IgApiClient();
  const auth = await igAuth(ig);

  const loop = () =>
    likeFeed(ig, auth)
      .then(log.likes)
      .then(() => watchStories(ig))
      .then(log.views)
      .catch(log.error)
      .then(delay(5))
      .then(loop);

  loop();
};

start().catch(log.error);
