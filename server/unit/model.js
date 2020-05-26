'use strict';

const db = require('../database/database');

const unitModel = {};

const unit_columns = ['name', 'unit_type', 'stars', 'hp', 'pap', 'pd', 'sap', 'sd', 'bap', 'bp', 'pdf', 'sdf', 'bdf', 'ld', 'tc', 'hl', 'speed', 'unit_range', 'ammo', 'labour', 'img', 'vet_img'];

unitModel.getAll = async () =>{
    const sql_text = 'SELECT * FROM units ORDER BY name ASC;';
    const data = await db.con.query(sql_text);
    return data
}

unitModel.getUnit = async (term) =>{
    const unit_id = parseInt(term, 10);
    if(isNaN(unit_id)){
        return await unitModel.getUnitByName(term);
    }else{
        return await unitModel.getUnitById(unit_id);
    }
}
unitModel.getUnitById = async (id) =>{
    const sql_text = 'SELECT * FROM units WHERE id= ?;';
    const data = await db.con.query(sql_text, [id]);
    if(!data[0]){
        throw Error('Unit Not Found')
    }
    return data[0];
}

unitModel.getUnitByName = async(name) =>{
    const sql_text = 'SELECT * FROM units WHERE name LIKE ?;';
    const data = await db.con.query(sql_text, [`%${name}%`]);
    if(!data[0]){
        throw Error('Unit Not Found')
    }
    return data[0];
}

unitModel.insertUnit = async (body) =>{
    let column_text = 'name';
    let value_text = `${db.con.escape(body.name)}`;
    for (let i = 1; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(body[element]!==undefined){
            column_text += ', ' + element;
            value_text += ', ' + db.con.escape(body[element]);
        }
    }
    const sql_query = `INSERT INTO units (${column_text}) VALUES (${value_text});`; 
    const data = await db.con.query(sql_query);
    return data;
    
}

unitModel.modifyUnit = async (id, body) => {
    let set_text = '';

    for (let i = 0; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(body[element]!==undefined && body[element]!==null){
            if(set_text===''){
                set_text += `${element} = ${db.con.escape(body[element])}`;
            }else{
                set_text += `, ${element} = ${db.con.escape(body[element])}`;
            }
        }
    }
    if(set_text===''){
        throw Execption('No Update Arguments');
    }
    const sql_query = `UPDATE units SET ${set_text} WHERE id = ?;`;
    const data = await db.con.query(sql_query, [id]);
    return data;
}


module.exports = unitModel;