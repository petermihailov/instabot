const { format } = require('date-fns');
const {IgApiClient} = require('instagram-private-api');
const {username, password} = require('./account.json');

const likeFeed = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  const auth = await ig.account.login(username, password);
  const userFeed = ig.feed.timeline();
  const postsFirstPage = await userFeed.items();

  if (postsFirstPage.length) {
    // ToDo: add delay
    postsFirstPage
      .filter(({dr_ad_type, has_liked}) => !has_liked && !dr_ad_type)
      .forEach(async ({id, user}) => {
        await ig.media.like({
          mediaId: id,
          moduleInfo: {
            module_name: 'feed_timeline',
            user_id: auth.pk,
            username: auth.username,
          },
        });

        console.log(format(Date.now(), 'kk:mm:ss') + ' ' + user.username);
      });
  }
};

module.exports = likeFeed;
