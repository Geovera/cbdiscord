const db = require('../../database/database');

const model = {};


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

module.exports = model;