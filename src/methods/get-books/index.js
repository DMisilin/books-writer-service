const MainMethod = require('../../module/main-method.js');

class GetBooks extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async (request, response) => {
            console.log('--> Response getBooks');
            const result = await this.db.getQueryResult('getBooks');

            console.log('<-- Result getBooks: ', JSON.stringify(result));
            response.send(result);
        }
    }
}

module.exports = GetBooks;
