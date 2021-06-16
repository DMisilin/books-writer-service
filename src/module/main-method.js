const {v4: uuidV4} = require('uuid');
const db = require('./postgres/pg.js');
const config = require('../config.json');

class MainMethod {
    constructor() {
        this.db = db;
        this.config = config;
    }

    async addContent(response, {text, bookId}) {
        const texts = this.breakText(text);
        const result = [];

        let data;
        let hashPrev = uuidV4();
        let contentHash = uuidV4();
        let hashNext = uuidV4();

        for (let i = 0; i < texts.length; i++) {
            try {
                [{hash: data}] = await this.db.getQueryResult('addContent', [
                    texts[i],
                    bookId,
                    contentHash,
                    hashNext,
                    hashPrev,
                    i === texts.length - 1,
                    i === 0,
                ]);
            } catch(err) {
                console.error('Error for add new content! Msg: ', err.message);
                response.status(400).send({error: `CAN_NOT_ADD_CONTENT`});
            }

            result.push(data);
            hashPrev = contentHash;
            contentHash = hashNext;
            hashNext = uuidV4();
        }

        return result;
    }

    breakText(text) {
        const result = [];
        const {maxSize} = this.config.content;

        if (text.length <= maxSize) {
            return [text];
        }

        let tail = text;
        let head;

        do {
            head = tail.slice(0, maxSize / 2);
            tail = tail.slice(maxSize / 2);

            result.push(head);
        } while(tail.length > maxSize);

        result.push(tail);

        return result;
    }
}

module.exports = MainMethod;
