const InstaBot = require('./bot');
const Logger = require('./logger.js');
const account = require('./account.json');

const interval = 5 * 60 * 1000;
const depth = 5;
const logger = new Logger(account.name);

const bot = new InstaBot(account, {logger, depth, interval});
bot.start();
