const path = require('path');
const Client = require('instagram-private-api').V1;

const cleanUrl = (url) => url.split('?')[0];

class InstaBot {
  constructor(account, options) {
    const {name} = account;
    this.timer = null;
    this.account = account;
    this.interval = options.interval || 1 * 60 * 1000;
    this.depth = options.depth || 1;
    this.logger = options.logger || {
      log: Function.prototype,
      error: Function.prototype
    };

    this.device = new Client.Device(name + '-device');
    this.storage = new Client.CookieFileStorage(path.join(__dirname, '/cookies/', name + '.json'));
  }

  start() {
    if (!this.timer) {
      this.timer = setInterval(this.start.bind(this), this.interval);
    }

    this.createSession()
      .then(
        (session) => {
          const initFeed = this.getFeed(session);
          this.likeFeed(session, initFeed);
        },
        (error) => this.logger.error(error.message)
      )
  }

  createSession() {
    const {login, password} = this.account;
    return Client.Session.create(this.device, this.storage, login, password);
  }

  getFeed(session) {
    return new Client.Feed.Timeline(session);
  }

  likeFeed(session, feed, cursorCount = 1) {
    if (cursorCount <= this.depth) {
      feed.get()
        .then((data) => {
            const posts = data.filter(
              ({_params: p}) => !p.hasLiked && !this.account.blackList.includes(p.user.username)
            );

            this.likePosts(session, posts).then(() => {
              this.likeFeed(session, feed, ++cursorCount);
            });
          }
        );
    }
  }

  likePosts(session, posts) {
    return Promise.all(posts.map((media) => {
      const mediaId = media.id.split('_')[0];
      const {likeCount, user} = media._params;
      const username = user.username;

      return Client.Like.create(session, mediaId).then(() => {
        this.logger.log(`👤${username} ${likeCount !== 0 ? '❤' + likeCount : '🥇'} ${this.getMediaUrl(media)}`);
      });
    }));
  }

  getMediaUrl({_params: p}) {
    let url = '';

    if (p.video) {
      url = p.video.versions[0].url;
    } else if (Array.isArray(p.images[0])) {
      url = p.images.map((img) => cleanUrl(img[0].url)).join(', ');
    } else {
      url = cleanUrl(p.images[0].url);
    }

    return url;
  }
}

module.exports = InstaBot;