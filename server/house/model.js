const db = require('../database/database');

const model = {};

const h_columns = ['house_name', 'house_level', 'camp_location'];

model.getAll = async () => {
    const sql_text = `SELECT h.*, u.username as liege_username
                      FROM houses as h
                      LEFT JOIN users as u on h.liege_id = u.id;`;
    const data = await db.pool.query(sql_text);
    
    return data;
}

model.getHouse = async(house_id) => {
    const sql_text = `SELECT h.*, u.username as liege_username
                      FROM houses as h
                      LEFT JOIN users as u on u.id = h.liege_id 
                      WHERE h.id = ? LIMIT 1`;
    const data = await db.pool.query(sql_text, house_id);
    
    return data[0];
}

model.insertHouse = async(body, liege_id) => {

    let column_text = 'liege_id';
    let value_text = `${db.pool.escape(liege_id)}`
    if(body){
        for (let i = 0; i < h_columns.length; i++) {
            const element = h_columns[i];
            if(body[element]!==undefined && body[element]!==null){
                column_text += ', ' + element;
                value_text += ', ' + db.pool.escape(body[element]);
            }
        }
    }
    const sql_text = `INSERT INTO houses (${column_text}) VALUES (${value_text});`
    const sql_text2 = `SELECT @house_id:=h.id
                      FROM houses as h
                      WHERE h.liege_id = ? LIMIT 1;   `
    const sql_text3 = `UPDATE users
                      SET house_id = @house_id, lk_house_role = 'lg'
                      WHERE id = ?;`;

    let con = await db.pool.getConnection();
    
    await con.query('START TRANSACTION;');

    await con.query(sql_text);
    await con.query(sql_text2, [liege_id])
    await con.query(sql_text3, [liege_id]);

    await con.query('COMMIT;');

    await con.release();
}

model.modifyHouse = async(house_id, body) => {

    let set_text = '';

    for (let i = 0; i < h_columns.length; i++) {
        const element = h_columns[i];
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

    const sql_text = `UPDATE houses SET ${set_text} WHERE id = ?`
    await db.pool.query(sql_text, [house_id]);
};

model.deleteHouse = async(house_id) => {
    const sql_text = 'UPDATE users SET lk_house_role = NULL where house_id = ?';
    const sql_text2 = 'DELETE FROM houses WHERE id = ?;';

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;');

    await con.query(sql_text, [house_id]);
    await con.query(sql_text2, [house_id]);

    await con.query('COMMIT;');

    await con.release();
}

module.exports = model;