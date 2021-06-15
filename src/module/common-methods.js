const {v4: uuidV4} = require('uuid');
const {content: {maxSize}} = require('../config.json');

module.exports = {
    async addContent(response, db, {text, bookId}) {
        // const [hashData] = await db.getQueryResult('getContentByHash', [hash]);
        //
        // if (!hashData) {
        //     throw new Error(`Content with hash: '${hash}' not found`);
        // }
        //
        // let {first = false, last = false, bookId, hashPrev: prev, hashNext: next} = hashData;
        const texts = breakText(text);
        const result = [];

        let data;
        let hashPrev = uuidV4();
        let contentHash = uuidV4();
        let hashNext = uuidV4();

        for (let i = 0; i < texts.length; i++) {
            try {
                [{hash: data}] = await db.getQueryResult('addContent', [
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
    },
}

function breakText(text) {
    const result = [];

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
