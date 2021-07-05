const MainMethod = require('../../module/main-method.js');

class RemoveContent extends MainMethod {
    constructor(options) {
        super(options);
    }

    run() {
        return async (request, response) => {
            this.log.info('--> Response RemoveContent');
            const {hash} = request.body.data;

            const [{hashPrev, hashNext, first, last}] = await this.db.getQueryResultUpg('getContentByHash', {hash});

            if (!hashPrev && !hashNext) {
                this.log.error(`Content by hash: '${hash}' not found`);
                response.status(404).send({error: 'CONTENT_NOT_FOUND'});
            }

            const [[contentPrev], [contentNext]] = await Promise.all([
                this.db.getQueryResultUpg('getContentByHash', {hash: hashPrev}),
                this.db.getQueryResultUpg('getContentByHash', {hash: hashNext}),
            ]);

            if (!contentPrev && !contentNext) {
                this.log.error(`Content for modify: '${JSON.stringify({hashPrev, hashNext})}' not found`);
                response.status(404).send({error: 'CONTENT_FOR_MODIFY_NOT_FOUND'});
            }

            try {
                await this.db.getQueryResult('startTransaction');

                await Promise.all([
                    await this.modifyContentHashNext(hashNext, last, contentPrev),
                    await this.modifyContentHashPrev(hashPrev, first, contentNext),
                ]);

                await this.db.getQueryResultUpg('removeContent', {hash});
                await this.db.getQueryResultUpg('finishTransaction');
            } catch(err) {
                await this.db.getQueryResult('rejectTransaction');
                this.log.error(`Error for modify contents with hash: [${contentPrev.hash}, ${contentNext.hash}]`);
                response.status(400).send({error: 'CAN_NOT_REMOVE'});
                return;
            }

            this.log.info('<-- Result RemoveContent: ');
            this.showSpendTime(request);

            response.send({data: {}});
        }
    }

    async modifyContentHashNext(hashNext, last, contentPrev) {
        if (contentPrev) {
            await this.db.getQueryResultUpg('modifyContentHashNext',
                {
                    hashNext,
                    first: false,
                    last,
                    hash: contentPrev.hash
                });
        }
    }

    async modifyContentHashPrev(hashPrev, first, contentNext) {
        if (contentNext) {
            await this.db.getQueryResultUpg('modifyContentHashPrev',
                {
                    hashPrev,
                    first,
                    last: false,
                    hash: contentNext.hash
                });
        }
    }
}

module.exports = RemoveContent;
