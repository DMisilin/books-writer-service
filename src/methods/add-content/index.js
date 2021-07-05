const MainMethod = require('../../module/main-method.js');

class AddContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async (request, response) => {
            this.log.info('--> Request AddContent ');
            const {text, bookId} = request.body.data;
            let data;

            try {
                data = await this.addContentOnClean({text, bookId});
            } catch (err) {
                this.log.error(`Error add content! Msg: `, err.message);
                response.status(400).send({error: err.message});
                return;
            }

            this.log.info('<-- Response AddContent: ');
            this.showSpendTime(request);

            response.send({data});
        }
    }
}

module.exports = AddContent;
