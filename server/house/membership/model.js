const db = require('../../database/database');

const model = {};


async function checkHouseRequest(house_id, user_id){
    const sql_exists = 'SELECT EXISTS(SELECT * FROM house_requests WHERE house_id = ? AND user_id = ?) as result;'
    const exists = await db.pool.query(sql_exists, [house_id , user_id]);
    if(exists[0] && exists[0].result===0){
        throw Error("Membership request not send for user's house")
    }
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

model.modifyMemberRole = async(member_id, role) => {
    const sql_text = 'UPDATE users SET lk_house_role = ? WHERE id = ?;';

    await db.pool.query(sql_text, [role, member_id]);
}

// DELETE AFTER CHANGING MODEL
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

model.leaveHouse = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ?;';

    await db.pool.query(sql_text, [user_id]);
}

model.deleteMember = async(user_id) => {
    const sql_text = 'UPDATE users SET house_id = NULL, lk_house_role = NULL WHERE id = ? AND lk_house_role != \'lg\';';

    await db.pool.query(sql_text, [user_id]);
}

module.exports = model;