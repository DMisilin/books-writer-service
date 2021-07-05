const Pool = require('pg-pool');
const {pg: pgConf} = require('../../config.json').db;
const queries = require('./queries.js');

const pool = new Pool(pgConf);

module.exports = {
    /**
     * Method from db by upgrade query
     * @param {string} queryName Text
     * @param {Object} params Params
     * */
    async getQueryResult(queryName, params = {}) {
        let client;
        let data;

        if (!queries[queryName]) {
            throw new Error(`Query with name: '${queryName}' not found`);
        }

        try {
            client = await pool.connect();
            const preparedQuery = this.prepareQuery(queries[queryName], params);
            data = await client.query(preparedQuery);
        } catch (err) {
            console.error('Error! ', err.message);
            throw err;
        } finally {
            if (client) client.release();
        }

        return data.rows || [];
    },

    /**
     * Method prepare query
     * @param {string} query Query
     * @param {Object} params Query params
     * @return {string} result Result
     * */
    prepareQuery(query, params) {
        if (typeof params !== 'object') {
            throw new Error('Params must be Object');
        }

        let result = query;
        const keys = Object.keys(params);

        for (const value of keys) {
            result = result.replace(`:${value}`, typeof params[value] === 'string' ? `'${params[value]}'` : params[value]);
        }

        return result;
    },
};
