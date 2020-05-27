const db = require('../database/database');

const model = {};

const h_columns = ['house_name', 'house_level', 'camp_location'];

async function checkHouseRequest(house_id, user_id){
    const sql_exists = 'SELECT EXISTS(SELECT * FROM house_requests WHERE house_id = ? AND user_id = ?) as result;'
    const exists = await db.pool.query(sql_exists, [house_id , user_id]);
    if(exists[0] && exists[0].result===0){
        throw Error("Membership request not send for user's house")
    }
}

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

model.deleteHouse = async(house_id, liege_id) => {
    const sql_text = 'DELETE FROM houses WHERE id = ?;';
    const sql_text2 = 'UPDATE users SET lk_house_role = NULL where id = ?;'

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;');

    await con.query(sql_text, [house_id]);
    await con.query(sql_text2, [liege_id]);

    await con.query('COMMIT;');

    await con.release();
}

model.sendRequest = async(house_id, user_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?';
    const sql_text2 = 'INSERT INTO house_requests (house_id, user_id) VALUES (?, ?)';

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;');

    await con.query(sql_text, [user_id]);
    await con.query(sql_text2, [house_id, user_id]);

    await con.query('COMMIT;');

    await con.release();
};

model.cancelRequests = async(user_id) => {
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?';

    await db.pool.query(sql_text, [user_id]);
}

model.getHouseRequests = async(house_id) => {
    const sql_text = `SELECT u.id, u.username 
                      FROM house_requests as hr
                      LEFT JOIN users as u ON u.id = hr.user_id
                      WHERE hr.house_id = ?;`
    const data = await db.pool.query(sql_text, [house_id]);

    return data;
}

model.acceptRequest = async(user_id, house_id) => {
    checkHouseRequest(house_id, user_id);
    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?;';
    const sql_text2 = 'UPDATE users SET house_id = ?, lk_house_role = \'kng\' WHERE id = ?;';

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;');

    await con.query(sql_text, [user_id]);
    await con.query(sql_text2, [house_id, user_id]);

    await con.query('COMMIT;');

    await con.release();
}

model.rejectRequest = async(user_id, house_id) => {
    checkHouseRequest(house_id, user_id);

    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?;';

    await db.pool.query(sql_text, [user_id]);
}

model.deleteMember = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ? AND lk_house_role != \'lg\';';

    await db.pool.query(sql_text, [user_id]);
}

model.leaveHouse = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ?;';

    await db.pool.query(sql_text, [user_id]);
}

model.getMembers = async(house_id) => {
    const sql_text = `SELECT u.id, u.username, u.leadership, hr.lk_name as house_role, hr.lk_key
                      FROM users as u
                      LEFT JOIN house_role_lk as hr ON hr.lk_key = u.lk_house_role
                      WHERE u.house_id = ?;`;

    const data = await db.pool.query(sql_text, [house_id]);
    return data;
}

model.modifyMemberRole = async(member_id, role) => {
    const sql_text = 'UPDATE users SET lk_house_role = ? WHERE id = ?;';

    await db.pool.query(sql_text, [role, member_id]);
}

model.changeHouseLiege = async(liege_id, member_id) => {
    const sql_text = `UPDATE users SET lk_house_role = 'kng' WHERE id = ?;`;
    const sql_text2 = `UPDATE users SET lk_house_role = 'lg' WHERE id = ?;`;

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;')

    await con.query(sql_text, [liege_id]);
    await con.query(sql_text2, [member_id]);

    await con.query('COMMIT;');

    await con.release();
}

model.getMemberUnits = async(member_id) => {
    const sql_text = `SELECT u.*, uu.unit_level, uu.elite_flg 
                     FROM users as us
                     LEFT JOIN users_units as uu ON us.id = uu.user_id
                     LEFT JOIN units as u ON uu.unit_id = u.id
                     WHERE us.id = ? ORDER BY u.name ASC;`
    const data = await db.pool.query(sql_text, [member_id]);
    return data;
}

model.getCurrentWar = async() => {
    const sql_text = 'SELECT * FROM war_days WHERE completed = 0 LIMIT 1;'

    const data = await db.pool.query(sql_text);
    return data[0];
}

model.insertNewWar = async() => {
    const sql_text = 'UPDATE war_days SET completed = 1;';
    const sql_text2 = 'INSERT INTO war_days (day) VALUES (CURDATE());'

    let con = await db.pool.getConnection()

    await con.query('START TRANSACTION;');

    await con.query(sql_text);
    await con.query(sql_text2);

    await con.query('COMMIT;');

    await con.release();
}

model.warParticipation = async (user_id, house_id, decision) => {
    const sql_text = 'SELECT @current_war_id:=id FROM war_days WHERE completed = 0 LIMIT 1;';
    const sql_text2 = `INSERT INTO users_war (user_id, war_id, house_id, decision) VALUES (?, @current_war_id, ?, ?) 
                       ON DUPLICATE KEY UPDATE decision = ?`;

    let con = await db.pool.getConnection();

    await con.query('START TRANSACTION;');
    
    await con.query(sql_text);
    await con.query(sql_text2, [user_id, house_id, decision, decision]);

    await con.query('COMMIT;');

    await con.release();
}

model.getParticipation = async (house_id) => {
    const sql_text = `SELECT u.username, uw.decision
                      FROM users as u
                      LEFT JOIN users_war as uw ON uw.user_id = u.id
                      LEFT JOIN war_days as w ON w.id = uw.war_id
                      WHERE uw.house_id = ? AND w.completed = 0;`;

    const data = await db.pool.query(sql_text, [house_id]);
    return data;
}

module.exports = model;