const {v4: uuidV4} = require('uuid');
const schema = require('./schema.js');
const MainMethod = require('../../module/main-method.js');

class ModifyContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async(request, response) => {
            this.validateBody(request.body.data, schema);
            this.log.info('--> Request ModifyContent');
            const {text, hash} = request.body.data;
            const [contentData] = await this.db.getQueryResult('getContentByHash', [hash]);

            if (!contentData) {
                this.log.error(`Content with hash: '${hash}' not found`);
                response.status(404).send({error: `CONTENT_NOT_FOUND`});
                return;
            }

            const {last, first, bookId, hashPrev, hashNext} = contentData;

            const texts = this.splitText(text);

            if (texts.length === 1) {
                await this.db.getQueryResult('modifyContentWithText', [text, first, last, hashPrev, hashNext, hash]);
                response.send({data: {}});
                return;
            }

            const currentHash = uuidV4();

            try {
                await this.modifyContent(response, {
                    hash,
                    hashPrev,
                    hashNext: currentHash,
                    text: texts[0],
                    first
                });

                await this.addContent(request, {
                    texts: texts.slice(1),
                    bookId,
                    first,
                    last,
                    currentHash,
                    oldHashPref: hash,
                    oldHashNext: hashNext
                });
            } catch (err) {
                response.status(400).send({error: err.message});
                return;
            }

            response.send({data: {}});
            this.log.info('<-- Response ModifyContent');
        }
    }
}

module.exports = ModifyContent;
