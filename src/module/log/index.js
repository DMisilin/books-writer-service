const Logger = require('./logger.js');

let log;

module.exports = {
    getLogger() {
        if (log) {
            return log;
        }

        log = new Logger();

        return log;
    }
}
