const db = require('../database/database');

const model = {};

const h_columns = ['house_name', 'house_level', 'camp_location'];

model.getAll = async () => {
    const sql_text = `SELECT h.*, u.username as liege_username
                      FROM houses as h
                      LEFT JOIN users as u on h.liege_id = u.id;`;
    const data = await db.con.query(sql_text);
    
    return data;
}

model.getHouse = async() => {
    // implement getting house details
    throw Error('Not Implemented');
}

model.insertHouse = async(body, liege_id) => {

    let column_text = 'liege_id';
    let value_text = `${db.con.escape(liege_id)}`
    if(body){
        for (let i = 0; i < h_columns.length; i++) {
            const element = h_columns[i];
            if(body[element]!==undefined){
                column_text += ', ' + element;
                value_text += ', ' + db.con.escape(body[element]);
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

    const aaa = await db.con.query('START TRANSACTION');

    await db.con.query(sql_text);
    await db.con.query(sql_text2, [liege_id])
    await db.con.query(sql_text3, [liege_id]);

    await db.con.query('COMMIT');
}

model.modifyHouse = async(house_id, body) => {

    let set_text = '';

    for (let i = 0; i < h_columns.length; i++) {
        const element = h_columns[i];
        if(body[element]!==undefined){
            if(set_text===''){
                set_text += `${element} = ${db.con.escape(body[element])}`;
            }else{
                set_text += `, ${element} = ${db.con.escape(body[element])}`;
            }
        }
    }
    if(set_text===''){
        throw Error('No Params to Update')
    }

    const sql_text = `UPDATE houses SET ${set_text} WHERE id = ?`
    await db.con.query(sql_text, [house_id]);
};

model.deleteHouse = async(house_id, liege_id) => {
    const sql_text = 'DELETE FROM houses WHERE id = ?;';
    const sql_text2 = 'UPDATE users SET lk_house_role = NULL where id = ?;'

    await db.con.query('START TRANSACTION;');

    await db.con.query(sql_text, [house_id]);
    await db.con.query(sql_text2, [liege_id]);

    await db.con.query('COMMIT;')
}

model.sendRequest = async(house_id, user_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?';
    const sql_text2 = 'INSERT INTO house_requests (house_id, user_id) VALUES (?, ?)';

    await db.con.query('START TRANSACTION;');

    await db.con.query(sql_text, [user_id]);
    await db.con.query(sql_text2, [house_id, user_id]);

    await db.con.query('COMMIT;');
};

model.cancelRequests = async(user_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?';

    await db.con.query(sql_text, [user_id]);
}

model.getHouseRequests = async(house_id) => {
    const sql_text = `SELECT u.id, u.username 
                      FROM house_requests as hr
                      LEFT JOIN users as u ON u.id = hr.user_id
                      WHERE hr.house_id = ?;`
    const data = await db.con.query(sql_text, [house_id]);

    return data;
}

model.acceptRequest = async(user_id, house_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?;';
    const sql_text2 = 'UPDATE users SET house_id = ?, lk_house_role = \'kng\' WHERE id = ?;';

    await db.con.query('START TRANSACTION;');

    await db.con.query(sql_text, [user_id]);
    await db.con.query(sql_text2, [house_id, user_id]);

    await db.con.query('COMMIT;');
}

model.refuseRequest = async(user_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?;';

    await db.con.query(sql_text, [user_id]);
}

model.deleteMember = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ? AND lk_house_role != \'lg\';';

    await db.con.query(sql_text, [user_id]);
}

model.leaveHouse = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ?;';

    await db.con.query(sql_text, [user_id]);
}

module.exports = model;