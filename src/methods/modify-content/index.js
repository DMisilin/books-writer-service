const MainMethod = require('../../module/main-method.js');

class ModifyContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async(response, request) => {
            const {text, hash} = request.body.data;

            const hashData = await getHash();

            if (!hashData) {
                throw new Error(`Hash by '${hash}' not found`);
            }

            const texts = this.breakText(text);

            await modifyContent()

            await this.addContent();
        }
    }

    async getHash() {

    }
}

module.exports = ModifyContent;
