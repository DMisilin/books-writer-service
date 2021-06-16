function run(db) {
    return async (request, response) => {
        console.log('--> Response to index');
        const result = await db.getQueryResult('getBooks');

        console.log('<-- Result: ', JSON.stringify(result));
        response.send(result);
    }
}

module.exports = run;
