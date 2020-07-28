'use strict'
const bcrypt = require('bcryptjs');
const ENV = require('../settings');
const crypto = {};

//    """Someday, I will implement encryption and decryption. Today is not that day"""
crypto.hash = async (data) =>{
    const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(data, ENV.PASSWORD_SALT, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
    })
    return hash;
}

module.exports = crypto;