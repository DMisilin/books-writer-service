const {v4: uuidV4} = require('uuid');
const MainMethod = require('../../module/main-method.js');

class ModifyContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async(request, response) => {
            this.log.info('--> Request ModifyContent');
            const {text, hash} = request.body.data;
            const [contentData] = await this.db.getQueryResultUpg('getContentByHash', {hash});

            if (!contentData) {
                this.log.error(`Content with hash: '${hash}' not found`);
                response.status(404).send({error: `CONTENT_NOT_FOUND`});
                return;
            }

            const {last, first, bookId, hashPrev, hashNext} = contentData;

            const texts = this.splitText(text);

            if (texts.length === 1) {
                await this.db.getQueryResultUpg('modifyContentWithText',
                    {
                        text,
                        first,
                        last,
                        hashPrev,
                        hashNext,
                        hash
                    });

                response.send({data: {}});
                return;
            }

            const currentHash = uuidV4();

            try {
                await this.modifyContent({
                    hash,
                    hashPrev,
                    hashNext: currentHash,
                    text: texts[0],
                    first
                });

                await this.addContent({
                    texts: texts.slice(1),
                    bookId,
                    first,
                    last,
                    currentHash,
                    oldHashPref: hash,
                    oldHashNext: hashNext
                });
            } catch (err) {
                this.log.error('Error modify contents! Msg: ', err.message);
                response.status(400).send({error: err.message});
                return;
            }

            this.log.info('<-- Response ModifyContent');
            this.showSpendTime(request);

            response.send({data: {}});
        }
    }
}

module.exports = ModifyContent;
