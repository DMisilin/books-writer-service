const Ajv = require('ajv');
const logger = require('./log/index.js');
const log = logger.getLogger();

module.exports = {
    validateSchema() {
        return async (request, response, next) => {
            log.info('--> Schema validate start');
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
    }
}
