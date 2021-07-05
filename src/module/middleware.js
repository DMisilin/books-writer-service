const Ajv = require('ajv');
const Log = require('./log/logger.js');
const log = new Log();

module.exports = {
    /**
     * Middleware validation schema
     * */
    validateSchema() {
        return async (request, response, next) => {
            log.info('--> Schema validate start', request.body.data);
            const ajv = new Ajv();
            let validator;

            try {
                const schema = require(`${process.cwd()}/methods${request.url}/schema.js`);
                validator = ajv.compile(schema);
            } catch(err) {
                log.error(`Error schema require: `, err.message);
                response.status(400).send({error: 'ERROR_SCHEMA_REQUIRE'});
                return;
            }

            if (!validator(request.body.data)) {
                log.error('Error validate body! Msg: ', validator.errors[0].message);
                response.status(400).send({error: 'NOT_VALID_BODY'});
                return;
            }

            log.info('<-- Schema validate complete');
            next();
        }
    },

    /**
     * Middleware set start time
     * */
    setStartTime() {
        return async (request, response, next) => {
            request.startTime = new Date();
            next();
        }
    }
}
