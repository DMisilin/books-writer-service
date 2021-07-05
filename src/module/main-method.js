const {v4: uuidV4} = require('uuid');
const db = require('./postgres/pg.js');
const Config = require('./config/index.js');
const Log = require('./log/logger.js');

class MainMethod {
    /**
     * Main Method Constructor
     * */
    constructor() {
        this.db = db;
        this.config = new Config().get();
        this.log = new Log();
    }

    /**
     * Method create first content
     * @param {Object} params Params
     * @param {string} params.text Text content
     * @param {number} params.bookId Book id
     * */
    async addContentOnClean({text, bookId}) {
        const texts = this.splitText(text);
        const result = [];

        let addedHash;
        let hashPrev = uuidV4();
        let contentHash = uuidV4();
        let hashNext = uuidV4();

        for (let i = 0; i < texts.length; i++) {
            [{hash: addedHash}] = await this.db.getQueryResultUpg('addContent',
                {
                    text: texts[i],
                    bookId: bookId,
                    hash: contentHash,
                    hashNext,
                    hashPrev,
                    last: i === texts.length - 1,
                    first: i === 0
                });

            result.push(addedHash);
            hashPrev = contentHash;
            contentHash = hashNext;
            hashNext = uuidV4();
        }

        return {result};
    }

    /**
     * Method create content
     * @param {Object} params Params
     * @return {Object} result {result, hashPrev, hashNext}
     * */
    async addContent(params) {
        const {
            texts,
            bookId,
            last = false,
            currentHash,
            oldHashPref = null,
            oldHashNext = null
        } = params;
        const result = [];

        let addedHash;
        let hashPrev = oldHashPref || uuidV4();
        let contentHash = currentHash || uuidV4();
        let hashNext = uuidV4();

        for (let i = 0; i < texts.length; i++) {
            [{hash: addedHash}] = await this.db.getQueryResultUpg('addContent',
                {
                    text: texts[i],
                    bookId,
                    hash: contentHash,
                    hashNext,
                    hashPrev,
                    last: i === texts.length - 1 && last ? last : false,
                    first: false
                });

            result.push(addedHash);
            hashPrev = contentHash;
            contentHash = hashNext;
            hashNext = i === texts.length - 2 && oldHashNext ? oldHashNext : uuidV4();
        }

        return {result, hashPrev, hashNext};
    }

    /**
     * Method modify content
     * @param {Object} params Params
     * */
    async modifyContent(params) {
        const {
            hash = uuidV4(),
            hashPrev = uuidV4(),
            hashNext = uuidV4(),
            text,
            first = false,
            last = false
        } = params;

        await this.db.getQueryResultUpg('modifyContentWithText', {
            text,
            first,
            last,
            hashPrev,
            hashNext,
            hash,
        });
    }

    /**
     * Method split text
     * @param {string} text Text
     * @return {array<string>} result Result
     * */
    splitText(text) {
        const result = [];
        const {maxSize} = this.config.content;

        if (text.length <= maxSize) return [text];

        let tail = text;
        let head;

        do {
            head = tail.slice(0, maxSize / 2);
            tail = tail.slice(maxSize / 2);

            result.push(head);
        } while (tail.length > maxSize);

        result.push(tail);

        return result;
    }

    /**
     * Method logging spend time
     * @param {Object} request Request
     * @param {Date} [request.startTime = new Date()] Time start method
     * @param {string} request.url Url
     * */
    showSpendTime({startTime = new Date(), url}) {
        const endTime = new Date();
        this.log.info(`Spend time for '${url}' - ${(endTime - startTime) / 1000}s`);
    }
}

module.exports = MainMethod;
