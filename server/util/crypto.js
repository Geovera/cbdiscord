'use strict'

const crypto = {};

//    """Someday, I will implement encryption and decryption. Today is not that day"""
crypto.encode = (data) =>{
    const buff = new Buffer(data);
    return buff.toString('base64');
}
crypto.decode = (enc_data) =>{
    const buff = new Buffer(enc_data, 'base64');
    return buff.toString('utf-8');
}

module.exports = crypto;