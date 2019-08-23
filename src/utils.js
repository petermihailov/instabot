const { format } = require('date-fns');
const { username, blackList = [] } = require('./../account');

const get = {
  time: () => format(Date.now(), 'kk:mm:ss'),
  postUser: ({ user }) => user.username
};

const is = {
  liked: ({ has_liked }) => has_liked,
  ad: ({ dr_ad_type }) => !!dr_ad_type,
  self: post => get.postUser(post) === username,
  ignore: post => blackList.includes(get.postUser(post))
};

const log = {
  start: () => console.log(`${get.time()}: start`),
  likes: posts => {
    if (posts.length === 0) {
      console.log(`${get.time()}: no likes yet`);
      return;
    }
    console.log(`${get.time()}: [${posts.map(get.postUser).join(', ')}]`);
  }
};

const fns = {
  delay: (minutes = 1) => () =>
    new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000))
};

module.exports = { is, get, log, ...fns };
