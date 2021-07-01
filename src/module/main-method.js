const {v4: uuidV4} = require('uuid');
const db = require('./postgres/pg.js');
const config = require('../config.json');
const log = require('./log/index.js');

class MainMethod {
    constructor() {
        this.db = db;
        this.config = config;
        this.log = log.getLogger();
    }

    async addContentOnClean({text, bookId}) {
        const texts = this.splitText(text);
        const result = [];

        let addedHash;
        let hashPrev = uuidV4();
        let contentHash = uuidV4();
        let hashNext = uuidV4();

        for (let i = 0; i < texts.length; i++) {
            [{hash: addedHash}] = await this.db.getQueryResult('addContent', [
                texts[i],
                bookId,
                contentHash,
                hashNext,
                hashPrev,
                i === texts.length - 1,
                i === 0,
            ]);

            result.push(addedHash);
            hashPrev = contentHash;
            contentHash = hashNext;
            hashNext = uuidV4();
        }

        return {result};
    }

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
            [{hash: addedHash}] = await this.db.getQueryResult('addContent', [
                texts[i],
                bookId,
                contentHash,
                hashNext,
                hashPrev,
                i === texts.length - 1 && last ? last : false,
                false,
            ]);

            result.push(addedHash);
            hashPrev = contentHash;
            contentHash = hashNext;
            hashNext = i === texts.length - 2 && oldHashNext ? oldHashNext : uuidV4();
        }

        return {result, hashPrev, hashNext};
    }

    async modifyContent(params) {
        const {
            hash = uuidV4(),
            hashPrev = uuidV4(),
            hashNext = uuidV4(),
            text,
            first = false,
            last = false
        } = params;

        await this.db.getQueryResult('modifyContentWithText', [
            text,
            first,
            last,
            hashPrev,
            hashNext,
            hash,
        ]);
    }

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
}

module.exports = MainMethod;
