'use strict';

const MySQL = require('promise-mysql');
const ENV = require('../settings');
const db = {}

db.connectDB = async () =>{
    const pool = await MySQL.createPool({
        host:               ENV.DB_HOST,
        port:               ENV.DB_PORT,
        user:               ENV.DB_USER,
        password:           ENV.DB_PASS,
        database:           ENV.DB_NAME,
        connectionLimit:    10
    });
    console.log('Database connected');
    db.pool = pool;
}

module.exports = db;