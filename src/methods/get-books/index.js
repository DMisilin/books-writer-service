const MainMethod = require('../../module/main-method.js');

class GetBooks extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async (request, response) => {
            this.log.info('--> Response getBooks');
            let result;

            try {
                result = await this.db.getQueryResultUpg('getBooks');
            } catch (err) {
                response.status(400).send({error: err.message});
                return;
            }

            this.log.info('<-- Result getBooks: ', JSON.stringify(result));
            this.showSpendTime(request);

            response.send(result);
        }
    }
}

module.exports = GetBooks;
