'use strict'

const db = require('../database/database');
const unitModel = require('../unit/model');
const crypto = require('../util/crypto');

const userModel = {};

const uu_columns = ['unit_level', 'elite_flg'];

userModel.getUserFromId = async (id) => {
    const sql_text = 'SELECT id, discord_id, house_id, leadership FROM users WHERE id = ? LIMIT 1;';
    const data = await db.pool.query(sql_text,[id]);
    return data[0];
}
userModel.getUserFromDiscord = async (discordId) =>{
    const sql_text = 'SELECT id, discord_id, house_id, leadership FROM users WHERE discord_id = ? LIMIT 1;';
    const data = await db.pool.query(sql_text, [discordId]);
    return data[0];
}

userModel.getUser = async (context, next) => {
    let user = getUserFromId(context.params.id);
    if(user){
        context.response.body = {user: user};
    }else{
        context.throw(400, 'INVALID_ID');
    }
};

userModel.getUserFullFromId = async (id) => {
    const sql_text = `SELECT u.id, CAST(u.discord_id as CHAR(20)) as discord_id, u.house_id, u.leadership, u.lk_house_role, r.lk_permission_level
                      FROM users as u
                      LEFT JOIN house_role_lk as r ON r.lk_key = u.lk_house_role
                      WHERE u.id = ? LIMIT 1;`;
    const data = await db.pool.query(sql_text, [id]);

    return data[0];
}

userModel.getUserUnits = async(id) => {
    const sql_txt = `SELECT u.*, uu.unit_level, uu.elite_flg 
                     FROM users as us
                     LEFT JOIN users_units as uu ON us.id = uu.user_id
                     LEFT JOIN units as u ON uu.unit_id = u.id
                     WHERE us.id = ? ORDER BY u.name ASC;`
    const data = await db.pool.query(sql_txt, [id]);
    return data;
}

userModel.getUserUnitsInverse = async(id) => {
    const sql_txt = `SELECT u.*, 0 as unit_level, 0 as elite_flg
                     FROM units as u
                     LEFT JOIN (SELECT u.id as uid
                                FROM users as us
                                LEFT JOIN users_units as uu ON us.id = uu.user_id
                                LEFT JOIN units as u ON uu.unit_id = u.id
                                WHERE us.id = ? ORDER BY u.name ASC) as e ON e.uid = u.id
                     WHERE e.uid IS NULL;`
    const data = await db.pool.query(sql_txt, [id]);
    return data;
}

userModel.getUserUnit = async(id, term) =>{
    const unit_id = parseInt(term, 10);
    if(isNaN(unit_id)){
        return await userModel.getUserUnitByName(id, term);
    }else{
        return await userModel.getUserUnitById(id, unit_id);
    }
}

userModel.getUserUnitById = async (id, unit_id) =>{
    const sql_text = `SELECT u.*, uu.unit_level, uu.elite_flg 
                     FROM users as us
                     LEFT JOIN users_units as uu ON us.id = uu.user_id
                     LEFT JOIN units as u ON uu.unit_id = u.id
                     WHERE us.id = ? AND uu.unit_id = ? ORDER BY u.name ASC;`;
    const data = await db.pool.query(sql_text, [id, unit_id]);
    if(!data[0]){
        throw Error('Unit Not Found')
    }
    return data[0];
}

userModel.getUserUnitByName = async(id, name) =>{
    const sql_text = `SELECT u.*, uu.unit_level, uu.elite_flg 
                     FROM users as us
                     LEFT JOIN users_units as uu ON us.id = uu.user_id
                     LEFT JOIN units as u ON uu.unit_id = u.id
                     WHERE us.id = ? AND u.name LIKE ? ORDER BY u.name ASC;`
    const data = await db.pool.query(sql_text, [id, `%${name}%`]);
    if(!data[0]){
        throw Error('Unit Not Found')
    }
    return data[0];
}

userModel.assignUserUnit = async(id, unit_id, body) =>{
    const unit = await unitModel.getUnitById(unit_id);

    let column_text = 'user_id, unit_id';
    let value_text = `${db.pool.escape(id)}, ${db.pool.escape(unit_id)}`
    if(body){
        for (let i = 0; i < uu_columns.length; i++) {
            const element = uu_columns[i];
            if(body[element]!==undefined && body[element]!==null){
                column_text += ', ' + element;
                value_text += ', ' + db.pool.escape(body[element]);
            }
        }
    }
    const sql_text = `INSERT INTO users_units (${column_text}) VALUES (${value_text});`
    const data = await db.pool.query(sql_text);
}

userModel.modifyUserUnit = async(id, unit_id, body) =>{
    const unit = await unitModel.getUnitById(unit_id);
    let set_text = '';

    for (let i = 0; i < uu_columns.length; i++) {
        const element = uu_columns[i];
        if(body[element]!==undefined && body[element]!==null){
            if(set_text===''){
                set_text += `${element} = ${db.pool.escape(body[element])}`;
            }else{
                set_text += `, ${element} = ${db.pool.escape(body[element])}`;
            }
        }
    }
    if(set_text===''){
        throw Error('No Params to Update')
    }
    const sql_text = `UPDATE users_units SET ${set_text} WHERE user_id = ? AND unit_id = ?`
    const data = await db.pool.query(sql_text, [id, unit_id]);
}

userModel.deleteUserUnit = async (id, unit_id) => {
    const unit = await unitModel.getUnitById(unit_id);

    const sql_text = `DELETE FROM users_units WHERE user_id = ? AND unit_id = ?;`
    const data = await db.pool.query(sql_text, [id, unit_id]);
}

userModel.addDiscordIdToUser = async (user_id, discord_id) =>{
    const sql_text = 'UPDATE users SET discord_id = ? WHERE id = ?;';
    const data = await db.pool.query(sql_text, [discordId, user_id])
}

userModel.createUserWithDiscord = async (discord_id, username, password) =>{
    const hashPassword = await crypto.hash(password);
    const sql_text = 'INSERT INTO users (discord_id, username, password) VALUES (?, ?, ?);';
    await db.pool.query(sql_text, [discord_id, username, hashPassword]);
}

userModel.registerUser = async (username, password) =>{
    const hashPassword = await crypto.hash(password);

    const sql_text = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await db.pool.query(sql_text, [username, hashPassword])
}

userModel.loginUser = async (username, password) =>{
    const hashPassword = await crypto.hash(password);
    const sql_text = 'SELECT id, username from users WHERE username = ? AND password = ?';
    const data = await db.pool.query(sql_text, [username, hashPassword]);

    return data[0];
}

module.exports = userModel;