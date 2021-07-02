module.exports = {
    type: 'object',
    additionalProperties: true,
    required: ['port'],
    properties: {
        port: {type: 'number'},
        db: {
            type: 'object',
            additionalProperties: true,
            required: ['pg'],
            properties: {
                pg: {
                    type: 'object',
                    additionalProperties: true,
                    required: ['host', 'port', 'database', 'schema', 'user', 'password'],
                    properties: {
                        host: {type: 'string'},
                        port: {type: 'number'},
                        database: {type: 'string'},
                        schema: {type: 'string'},
                        user: {type: 'string'},
                        password: {type: 'string'},
                    }
                }
            }
        },
        content: {
            type: 'object',
            additionalProperties: false,
            required: ['minSize', 'maxSize'],
            properties: {
                minSize: {type: 'number'},
                maxSize: {type: 'number'}
            }
        }
    }
}
