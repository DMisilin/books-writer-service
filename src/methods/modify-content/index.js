const {v4: uuidV4} = require('uuid');
const MainMethod = require('../../module/main-method.js');

class ModifyContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async(request, response) => {
            console.log('--> Request ModifyContent');

            const {text, hash} = request.body.data;
            const [contentData] = await this.db.getQueryResult('getContentByHash', [hash]);

            if (!contentData) {
                console.error(`Content with hash: '${hash}' not found`);
                response.status(404).send({error: `CONTENT_NOT_FOUND`});
                return;
            }

            const {last, first, bookId, hashPrev, hashNext} = contentData;

            const texts = this.breakText(text);

            if (texts.length === 1) {
                await this.db.getQueryResult('modifyContent', [text, first, last, hashPrev, hashNext, hash]);
                response.send({data: {}});
            }

            const currentHash = uuidV4();

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

            response.send({data: {}});

            console.log('<-- Response ModifyContent');
        }
    }
}

module.exports = ModifyContent;
