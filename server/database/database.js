'use strict';

const MySQL = require('promise-mysql');
const ENV = require('../settings');
const db = {}

db.connectDB = async () =>{
    const connection = await MySQL.createConnection({
        host:     ENV.DB_HOST,
        port:     ENV.DB_PORT,
        user:     ENV.DB_USER,
        password: ENV.DB_PASS,
        database: ENV.DB_NAME
    });
    console.log('Database connected');
    db.con = connection;
}

module.exports = db;