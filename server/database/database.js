'use strict';

const fs = require('fs');
const MySQL = require('promise-mysql');

let config_file = fs.readFileSync('./database/config.json');
let db_config = JSON.parse(config_file);

const db = {}

let connection = MySQL.createConnection(db_config);

connection.then((con) =>{
    console.log('Database Connected');
    db.con = con;
});

module.exports = db;