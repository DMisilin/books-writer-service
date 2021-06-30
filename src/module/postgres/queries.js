module.exports = {
    // TEST
    getTime: `SELECT NOW();`,
    getTest: `SELECT * FROM books;`,

    // TRANSACTION
    startTransaction: `BEGIN;`,
    finishTransaction: `COMMIT;`,
    rejectTransaction: `ROLLBACK;`,

    // SELECT
    getBooks: `
        SELECT
            book_id AS "bookId",
            title,
            description,
            author,
            create_datetime AS "createDatetime",
            state
        FROM 
            books;
    `,

    getBookById: `
        SELECT
            book_id AS "bookId",
            title,
            description,
            author,
            create_datetime AS "createDatetime",
            state
        FROM 
            books 
        WHERE
            state = 'enabled' 
            AND book_id = $1; 
    `,

    getContentByHash: `
        SELECT 
            last, 
            first,
            book_id AS "bookId",
            hash,
            hash_prev AS "hashPrev",
            hash_next AS "hashNext"
        FROM 
            content 
        WHERE 
            state = 'enabled' 
            AND hash = $1; 
    `,

    // INSERT
    addContent: `
        INSERT INTO 
            content (
                text, 
                book_id, 
                hash, 
                hash_next, 
                hash_prev, 
                last, 
                first
                )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING hash;
    `,

    // UPDATE
    modifyContentWithText: `
        UPDATE 
            content 
        SET 
            text = $1, 
            first = $2, 
            last = $3,
            hash_prev = $4,
            hash_next = $5,
            modify_datetime = NOW() 
        WHERE 
            hash = $6; 
    `,

    modifyContentHashPrev: `
        UPDATE 
            content 
        SET 
            hash_prev = $1,
            first = $2,
            last = $3,
            modify_datetime = NOW() 
        WHERE 
            hash = $4; 
    `,

    modifyContentHashNext: `
        UPDATE 
            content 
        SET 
            hash_next = $1,
            first = $2,
            last = $3,
            modify_datetime = NOW() 
        WHERE 
            hash = $4; 
    `,

    // DELETE
    removeContent: `
        DELETE 
        FROM 
            content 
        WHERE 
            hash = $1;
    `,
};
