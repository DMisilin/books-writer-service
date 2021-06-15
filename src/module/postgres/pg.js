const Pool = require('pg-pool');
const {pg: pgConf} = require('../../config.json').db;
const queries = require('./queries.js');

const pool = new Pool(pgConf);

module.exports = {
    async getQueryResult (queryName, value = []) {
        let client;
        let data;

        if (!queries[queryName]) {
            throw new Error(`Query with name: '${queryName}' not found`);
        }

        try {
            client = await pool.connect();
            data = await client.query(queries[queryName], value);
        } catch (err) {
            console.error('Error! ', err.message);
            throw err;
        } finally {
            if (client) client.release();
        }

        return data.rows || [];
    }
};
