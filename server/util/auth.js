'use strict';

const db = require('../database/database');

async function discordAuth(context, id){
    let sql_text = `SELECT TOP 1 * FROM users WHERE discordId='${id}'`;
    try{
        let data = await db.con.query(sql_text);
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
            discordAuth(context, discordId);
        }else if(sessionId!==undefined){
            sessionAuth(context, context.cookies.get('sessionId'));
        }else{
            context.throw(400, 'NO ID FOUND');
        }
        await next();
    }
}