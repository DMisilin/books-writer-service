const Ajv = require('ajv');
const schema = require('./config-schema.js');
const config = require('../../config.json');
const Log = require('../log/logger.js');

class Config {
    constructor() {
        this.config = null;
        this.validator = null;
        this.log = new Log();
    }

    get() {
        if (!this.config) {
            this.validate();
            this.config = config;
        }

        return this.config;
    }

    validate() {
        try {
            const ajv = new Ajv();
            this.validator = ajv.compile(schema);
        } catch (err) {
            console.error(err.message);
            throw new Error('Error create validator');
        }

        if (!this.validator(config)) {
            console.error(this.validator.errors);
            throw new Error('Config not valid');
        }
    }
}

module.exports = Config;