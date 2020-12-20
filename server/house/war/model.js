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

model.insertWarDate = async(date, parsed_date) => {

    const cur_war = await model.getCurrentWar();

    if(cur_war.day >= parsed_date){
        throw('Invalid date');
    }
    const sql_text = `UPDATE war_days SET completed = 1 WHERE id = ${cur_war.id};`;
    const in_date = parsed_date.toISOString().split('T')[0];
    const sql_text2 = `INSERT INTO war_days (day) VALUES (\'${in_date}\');`
    let con = await db.pool.getConnection()

    await con.query('START TRANSACTION;');

    await con.query(sql_text);
    await con.query(sql_text2);

    await con.query('COMMIT;');

    await con.release();
}

module.exports = model;