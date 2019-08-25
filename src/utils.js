const { format } = require('date-fns');
const { username, blackList = [] } = require('./../account');

const fns = {
  delay: (minutes = 1) => () =>
    new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000)),
  unique: arr => [...new Set(arr)]
};

const get = {
  time: () => format(Date.now(), 'kk:mm:ss'),
  user: ({ user }) => user,
  userName: ({ user }) => user.username,
  userPk: ({ user }) => user.pk
};

const is = {
  liked: ({ has_liked }) => has_liked,
  ad: ({ dr_ad_type }) => !!dr_ad_type,
  self: post => get.userName(post) === username,
  ignore: post => post.muted || blackList.includes(get.userName(post)),
  seen: ({ seen, latest_reel_media }) => latest_reel_media === seen
};

const log = {
  start: () => console.log(`${get.time()}: start`),
  likes: posts => {
    if (posts.length === 0) {
      console.log(`${get.time()}: no likes yet`);
      return;
    }
    console.log(`${get.time()}: ♥ [${posts.map(get.userName).join(', ')}]`);
  },
  views: stories => {
    if (stories.length === 0) {
      console.log(`${get.time()}: no stories yet`);
      return;
    }
    console.log(
      `${get.time()}: 👀 [${fns.unique(stories.map(get.userName)).join(', ')}]`
    );
  },
  error: console.log
};

module.exports = { is, get, log, ...fns };
