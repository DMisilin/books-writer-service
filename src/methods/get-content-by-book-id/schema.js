module.exports = {
    type: 'object',
    additionalProperties: false,
    required: ['bookId'],
    properties: {
        bookId: {type: 'number'}
    }
}