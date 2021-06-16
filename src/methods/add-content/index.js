const MainMethod = require('../../module/main-method.js');

class AddContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async (request, response) => {
            console.log('--> Request AddContent');

            const {text, bookId} = request.body.data;
            const data = await this.addContent(response, {text, bookId});

            console.log('<-- Response AddContent: ', JSON.stringify(data));
            response.send({data});
        }
    }
}

module.exports = AddContent;
