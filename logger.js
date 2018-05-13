const fs = require('fs');
const path = require('path');
const util = require('util');
const dateFns = require('date-fns');

class Logger {
  constructor(name, options = {dir: 'log', dateFormat: 'DD.MM.YYYY HH:mm:ss'}) {
    this.dateFormat = options.dateFormat;
    this.logFile = path.join(__dirname, options.dir, name + '.log');
  }

  log(msg, prefix = '') {
    const prefixTxt = prefix ? prefix + ' ' : '';

    fs.appendFile(
      this.logFile,
      util.format(prefixTxt + dateFns.format(new Date(), this.dateFormat), msg) + '\n',
      'utf8',
      (err) => {
        if (err) throw err
      }
    );
  }

  error(msg) {
    this.log(msg, '[ERR]')
  }
}

module.exports = Logger;
