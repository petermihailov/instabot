const likeFeed = require('./likeFeed');
const interval = 5 * 60 * 1000;
let counter = 0;

const loop = () => {
  console.log('start: ' + ++counter);
  likeFeed();
};

loop();
setInterval(loop, interval);
