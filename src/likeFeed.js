const { is } = require('./utils');

const likeFeed = async (ig, auth) => {
  const userFeed = ig.feed.timeline('pull_to_refresh');
  const feed = await userFeed.items();
  const likedPosts = [];

  if (feed.length) {
    const forLike = feed.filter(
      post =>
        !is.ad(post) && !is.liked(post) && !is.self(post) && !is.ignore(post)
    );

    for (const post of forLike) {
      await ig.media.like({
        mediaId: post.id,
        moduleInfo: {
          module_name: 'feed_timeline',
          user_id: auth.pk,
          username: auth.username
        }
      });

      likedPosts.push(post);
    }
  }

  return likedPosts;
};

module.exports = likeFeed;
