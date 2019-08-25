const { is, get } = require('./utils');

const withUserNames = (stories, tray) =>
  stories.map(story => ({
    ...story,
    user: {
      ...story.user,
      username: get.userName(
        tray.find(tray => get.userPk(tray) === get.userPk(story)) || {
          user: {}
        }
      )
    }
  }));

const watchStories = async ig => {
  const reelsTray = ig.feed.reelsTray();
  const tray = await reelsTray.items();
  const notSeen = tray.filter(story => !is.ignore(story) && !is.seen(story));
  const usersPk = notSeen.map(get.userPk);

  if (usersPk.length) {
    const reelsFeed = ig.feed.reelsMedia({ userIds: usersPk });
    const stories = await reelsFeed.items();

    return await ig.story
      .seen(stories)
      .then(() => withUserNames(stories, notSeen))
      .catch(() => []);
  }

  return await [];
};

module.exports = watchStories;
