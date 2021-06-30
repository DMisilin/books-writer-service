const Ajv = require('ajv');
const logger = require('./log/index.js');
const log = logger.getLogger();

module.exports = {
    validateSchema() {
        return async (request, response, next) => {
            log.info('--> Schema validate start');
            const ajv = new Ajv();
            const schema = require(`${process.cwd()}/methods${request.url}/schema.js`);
            const validator = ajv.compile(schema);

            if (!validator(request.body.data)) {
                log.error('Error validate body! Msg: ', validator.errors[0].message);
                response.status(400).send({error: 'NOT_VALID_BODY'});
                return;
            }

            log.info('<-- Schema validate complete');
            return true;
        }
    }
}
