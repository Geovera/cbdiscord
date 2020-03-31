'use strict'

const db = require('../database/database');

const users = {};

user.getUserFromId = async (idText, id) => {
    let sql_text = `SELECT TOP 1 id, discord_id, house_id, leadership FROM users WHERE ${idText} = ?`;
    try{
        let data = db.con.query(sql_text,[id]);
        return data;
    }catch(error){
        return undefined;
    }
}

users.getUser = async (context, next) => {
    let user = getUserFromId(context.params.id);
    if(user){
        context.response.body = {user: user};
    }else{
        context.throw(400, 'INVALID_ID')
    }
};

module.exports = users;