const db = require('../../../database/database');

const model = {};

async function checkHouseRequest(house_id, user_id){
    const sql_exists = 'SELECT EXISTS(SELECT * FROM house_requests WHERE house_id = ? AND user_id = ?) as result;'
    const exists = await db.pool.query(sql_exists, [house_id , user_id]);
    if(exists[0] && exists[0].result===0){
        throw Error("Membership request not send for user's house")
    }
}

model.getHouseRequests = async(house_id) => {
    const sql_text = `SELECT u.id, u.username 
                      FROM house_requests as hr
                      LEFT JOIN users as u ON u.id = hr.user_id
                      WHERE hr.house_id = ?;`
    const data = await db.pool.query(sql_text, [house_id]);

    return data;
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

model.rejectRequest = async(user_id, house_id) => {
    checkHouseRequest(house_id, user_id);

    const sql_text = 'DELETE FROM house_requests WHERE user_id = ?;';

    await db.pool.query(sql_text, [user_id]);
}

module.exports = model;