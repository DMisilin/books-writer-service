module.exports = {
    type: 'object',
    additionalProperties: false,
    required: ['text', 'hash'],
    properties: {
        text: {type: 'string'},
        hash: {type: 'string'},
        bookId: {type: 'number'}
    }
}