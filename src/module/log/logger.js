const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;
const {version} = require('../../package.json');

const myFormat = printf(({level, message, label, timestamp, ...args}) => {
    const data = JSON.stringify(args).replace(/\\/g, '');
    return `${timestamp} [v${label}] ${level}: ${message}. data: ${data}`;
});

class Log {
    /**
     * Log Constructor
     * */
    constructor() {
        this.logger = createLogger({
            format: combine(
                label({label: version}),
                timestamp(),
                myFormat
            ),
            transports: [new transports.Console()]
        });
    }

    /**
     * Method info log
     * @param {string} msg Text
     * @param {Array} args Params
     * */
    info(msg, ...args) {
        this.logger.log('info', msg, args);
    }

    /**
     * Method erro log
     * @param {string} msg Text
     * @param {Array} args Params
     * */
    error(msg, ...args) {
        this.logger.log('error', msg, args);
    }
}

module.exports = Log;
