const Ajv = require('ajv');
const schema = require('./config-schema.js');
const config = require('../../config.json');
const Log = require('../log/logger.js');

class Config {
    /**
    * Config Constructor
    * */
    constructor() {
        this.config = null;
        this.validator = null;
        this.log = new Log();
    }

    /**
     * Method get configuration
     * @return configuration
     * */
    get() {
        if (!this.config) {
            this.validate();
            this.config = config;
        }

        return this.config;
    }

    /**
     * Method for create Validator and validation configuration
     * */
    validate() {
        try {
            const ajv = new Ajv();
            this.validator = ajv.compile(schema);
        } catch (err) {
            this.log.error(err.message);
            throw new Error('Error create validator');
        }

        if (!this.validator(config)) {
            this.log.error(this.validator.errors);
            throw new Error('Config not valid');
        }
    }
}

module.exports = Config;