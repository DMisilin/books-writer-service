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
            AND book_id = :bookId; 
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
            AND hash = :hash; 
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
        VALUES (:text, :bookId, :hash, :hashNext, :hashPrev, :last, :first)
        RETURNING hash;
    `,

    // UPDATE
    modifyContentWithText: `
        UPDATE 
            content 
        SET 
            text = :text, 
            first = :first, 
            last = :last,
            hash_prev = :hashPrev,
            hash_next = :hashNext,
            modify_datetime = NOW() 
        WHERE 
            hash = :hash; 
    `,

    modifyContentHashPrev: `
        UPDATE 
            content 
        SET 
            hash_prev = :hashPrev,
            first = :first,
            last = :last,
            modify_datetime = NOW() 
        WHERE 
            hash = :hash; 
    `,

    modifyContentHashNext: `
        UPDATE 
            content 
        SET 
            hash_next = :hashNext,
            first = :first,
            last = :last,
            modify_datetime = NOW() 
        WHERE 
            hash = :hash; 
    `,

    // DELETE
    removeContent: `
        DELETE 
        FROM 
            content 
        WHERE 
            hash = :hash;
    `,
};
