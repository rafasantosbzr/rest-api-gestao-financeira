const { Pool } = require('pg');

const pool = new Pool ({
    host: 'localhost',
    port: '5432',
    username: 'postgres',
    password: '123456',
    database: 'dindin'
});

module.exports = pool;