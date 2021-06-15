const {addContent} = require('../../module/common-methods.js');

function index(db) {
    return async (request, response) => {
        console.log('--> Request index');

        const {text, bookId} = request.body.data;

        const data = await addContent(response, db, {text, bookId});

        // const bookHashes = await getHashByBookId();
        //
        // if (!bookHashes.length) {
        //     await createBookContent();
        // }
        //
        // const [result] = await db.getQueryResult('index', [text, bookId, contentHash, hashNext, hashPrev, false, false])
        //     .catch(err => {response.send(err.message)});

        console.log('<-- Response index');
        response.send({data});
    }
}

module.exports = index;
