const db = require('../../../database/database');

const model = {};

const PART_OPTIONS = {
    ALL:  '0',
    YES:  '1',
    NO:   '2',
    IDK:  '3',
    NULL: '4',
};
const TEMP_CONVERTER = {
    '0': false,
    '1': 'Yes',
    '2': 'No',
    '3': 'Idk',
    '4': 'Null',
}

const HOUSE_ROLES = {
    lg: 0,
    sen: 1,
    mar: 2,
    nob: 3,
    tre: 4,
    kng: 5
}
function hasHouseNoThrow(context){
    return context.user.house_id;
}
function checkPermissions(context, ROLE){
    if(!hasHouseNoThrow(context) || ROLE < context.user.lk_permission_level){
        context.throw(403, "No Permissions")
    }
}

function hasHouse(context){
    if(!context.user.house_id){
        context.throw(400, 'No house');
    }
}

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

async function getParticipation (house_id, option) {
    let sql_text = `SELECT u.username, uw.decision, CAST(u.discord_id as CHAR(20)) as discord_id
                      FROM users as u
                      LEFT JOIN users_war as uw ON uw.user_id = u.id
                      LEFT JOIN war_days as w ON w.id = uw.war_id
                      WHERE u.house_id = ? AND w.completed = 0`;

    if(option){
        sql_text += ` AND uw.decision = \"${option}\"`;
    }
    sql_text += ' ORDER BY uw.last_updated ASC;';

    const data = await db.pool.query(sql_text, [house_id]);
    return data;
}

async function getNullParticipation(house_id, war_id) {
    const sql_text = `SELECT u.username, CAST(u.discord_id as CHAR(20)) as discord_id
                      FROM users as u
                      WHERE u.house_id = ? AND u.id NOT IN(
                          SELECT u.id
                            FROM users_war as uw
                            LEFT JOIN users as u ON uw.user_id = u.id
                            WHERE u.house_id = ? AND uw.war_id = ?);`;

    const data = await db.pool.query(sql_text, [house_id, house_id, war_id]);
    return data;
}

model.getWarParticipation = async (context, option) => {
    hasHouse(context);
    try{
        const war = await model.getCurrentWar();
        if(!war){
            throw Error('Failed to get Current War');
        }
        let participation = {};
        switch(option){
            case PART_OPTIONS.NULL:
                participation = await getNullParticipation(context.user.house_id, war.id);
                break;
            default:
                participation = await getParticipation(context.user.house_id, TEMP_CONVERTER[option]);
                break;
        }
        context.response.status = 200;
        context.response.body = {war: war, participation: participation};
    }catch(error){
        console.log(error);
        context.throw('Failed to get Participation');
    }
}

model.getReminder = async (context) => {
    hasHouse(context);
    checkPermissions(context, HOUSE_ROLES.mar);

    try{
        const war = await model.getCurrentWar();
        if(!war){
            throw Error('Failed to get Current War');
        }
        let participation = await getNullParticipation(context.user.house_id, war.id);

        context.response.status = 200;
        context.response.body = {war: war, participation: participation};
    }catch(error){
        console.log(error);
        context.throw('Failed to get Participation');
    }
}

module.exports = model;