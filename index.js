const InstaBot = require('./bot');
const Logger = require('./logger.js');
const account = require('./account.json');

const logger = new Logger(account.name);
const bot = new InstaBot(account, {logger});
bot.start();
