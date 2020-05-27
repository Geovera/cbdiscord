'use strict';

const db = require('../database/database');
const crypto = require('./crypto');

async function discordAuth(context, id){
    let sql_text = `SELECT TOP 1 * FROM users WHERE discordId='${id}'`;
    try{
        let data = await db.pool.query(sql_text);
        console.log(data);
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID DISCORD ID')
    }
}

function sessionAuth(context, id) {
    console.log('NOT HERE');
}

module.exports = function(opts){
    return async function basicAuth(context, next){
        const discordId = context.cookies.get('discordId');
        const sessionId = context.cookies.get('sessionId');
        if(discordId!==undefined){
            dec_id = crypto.decode(discordId);
            discordAuth(context, discordId);
        }else if(sessionId!==undefined){
            dec_id = crypto.decode(dec_id);
            sessionAuth(context, dec_id);
        }else{
            context.throw(400, 'NO ID FOUND');
        }
        await next();
    }
}