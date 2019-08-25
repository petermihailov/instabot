const { username, password } = require('./../account.json');

const auth = async ig => {
  ig.state.generateDevice(username);
  return ig.account.login(username, password);
};

module.exports = auth;
