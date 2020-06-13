const db = require('../../../database/database');

const model = {};

// TO DELETE
model.getCurrentWar = async() => {
    const sql_text = 'SELECT * FROM war_days WHERE completed = 0 LIMIT 1;'

    const data = await db.pool.query(sql_text);
    return data[0];
}

model.warParticipation = async (user_id, house_id, decision) => {
    const sql_text = 'SELECT @current_war_id:=id FROM war_days WHERE completed = 0 LIMIT 1;';
    const sql_text2 = `INSERT INTO users_war (user_id, war_id, house_id, decision, last_updated) VALUES (?, @current_war_id, ?, ?, NOW()) 
                       ON DUPLICATE KEY UPDATE decision = ?, last_updated = NOW()`;

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
                      WHERE uw.house_id = ? AND w.completed = 0 
                      ORDER BY uw.last_updated ASC;`;

    const data = await db.pool.query(sql_text, [house_id]);
    return data;
}

module.exports = model;