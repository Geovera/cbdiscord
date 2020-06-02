const db = require('../../database/database');

const model = {};

model.getMembers = async(house_id) => {
    const sql_text = `SELECT u.id, u.username, u.leadership, hr.lk_name as house_role, hr.lk_key
                      FROM users as u
                      LEFT JOIN house_role_lk as hr ON hr.lk_key = u.lk_house_role
                      WHERE u.house_id = ?;`;

    const data = await db.pool.query(sql_text, [house_id]);
    return data;
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

module.exports = model;