'use strict';

const MySQL = require('promise-mysql');
const ENV = require('../settings');
const db = {}

let connection = MySQL.createConnection({
    host:     ENV.DB_HOST,
    port:     ENV.DB_PORT,
    user:     ENV.DB_USER,
    password: ENV.DB_PASS,
    database: ENV.DB_NAME
});

connection.then((con) =>{
    console.log('Database Connected');
    db.con = con;
});

module.exports = db;