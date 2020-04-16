'use strict';

const db = require('../database/database');

const units = {};

const unit_columns = ['name', 'type', 'stars', 'hp', 'pap', 'pd', 'sap', 'sd', 'bap', 'bp', 'pdf', 'sdf', 'bdf', 'leadership', 'troop_count', 'hero_level'];

units.getAll = async (context, next) =>{

    const sql_text = 'SELECT * FROM units ORDER BY name ASC';
    try{
        const data = await db.con.query(sql_text);
        context.response.body = {units: data};
    }catch(error){
        console.log(error);
        context.throw(400, 'Invalid Data');
    }
}
units.getUnit = async (context, next) =>{
    try{
        const units_data = await getUnit(context.params.term);
        if(units_data.length===0){
            context.throw(400, 'No Unit Found')
        }
        context.response.body = units_data[0];
        context.status = 200;
    }
    catch(error){
        console.log(error)
        context.throw(400, 'No Unit Found')
    }
}
async function getUnit(term) {
    const unit_id = parseInt(term, 10);
    if(isNaN(unit_id)){
        return await getUnitByName(term);
    }else{
        return await getUnitById(unit_id);
    }
}
async function getUnitById(id){
    const sql_text = 'SELECT * FROM units WHERE id= ?';
    const data = await db.con.query(sql_text, [id]);
    return data;
}

async function getUnitByName(name){
    const sql_text = 'SELECT * FROM units WHERE name LIKE ?';
    const data = await db.con.query(sql_text, [`%${context.params.name}%`]);
    return data;
}

units.insertUnit = async (context, next) =>{
    const body = context.request.body;
    let column_text = 'name';
    let value_text = `${db.con.escape(body.name)}`;
    for (let i = 1; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(body[element]!==undefined){
            column_text += ', ' + element;
            value_text += ', ' + db.con.escape(body[element]);
        }
    }
    const sql_query = 'INSERT INTO units (' + column_text + ') VALUES (' + value_text + ');'; 

    try{
        const data = await db.con.query(sql_query);
        context.response.status = 204
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID_DATA');
    }
    
}

units.modifyUnit = async (context, next) => {
    const body = context.request.body;
    if(!body){
        context.throw(400, 'No parameters')
    }
    try{
        const data = getUnitById(context.params.id)
        if(data.length===0){
            context.throw(400, 'No Unit exists')
        }
    }catch(error){
        console.log(error);
        context.throw(400, 'Invalid unit id')
    }
    let set_text = '';

    for (let i = 0; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(body[element]!==undefined){
            if(set_text===''){
                set_text += `${element} = ${db.con.escape(body[element])}`;
            }else{
                set_text += `, ${element} = ${db.con.escape(body[element])}`;
            }
        }
    }
    const sql_query = `UPDATE units SET ${set_text} WHERE id = ?`;

    try{
        const data = await db.con.query(sql_query, [context.params.id]);
        context.response.status = 204
    }catch(error){
        console.log(error);
        context.throw(400, 'Invalid Data');
    }
}


module.exports = units;