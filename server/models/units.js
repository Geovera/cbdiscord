const db = require('../database/database');

const units = {};

const unit_columns = ['name', 'type', 'stars', 'hp', 'pap', 'pd', 'sap', 'sd', 'bap', 'bp', 'pdf', 'sdf', 'bdf', 'leadership', 'troop_count', 'hero_level'];

units.getAll = async (context) =>{

    let sql_text = 'SELECT * FROM units';
    try{
        let data = await db.con.query(sql_text);
        return {units: data};
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID_DATA');
    }
}
units.getUnit = async (context, id) =>{

    let sql_text = `SELECT * FROM units WHERE id=${id}`;
    try{
        let data = await db.con.query(sql_text);
        return {unit: data};
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID_DATA');
    }
}


units.insertUnit = async (context, body) =>{
    let column_text = 'name, type';
    let value_text = `'${body.name}', '${body.type}'`;
    for (let i = 2; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(body[element]){
            column_text += ', ' + element;
            value_text += ', ' +body[element];
        }
    }
    let sql_query = 'INSERT INTO units (' + column_text + ') VALUES (' + value_text + ');'; 

    try{
        let data = await db.con.query(sql_query);
        return {status: 'success'};
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID_DATA');
    }
    
}

units.modifyUnit = async (context, body) => {
    let set_text = '';
    if(body.name && body.type){
        set_text += `name = '${body.name}' type = '${body.type}'`;
    }else if(body.name){
        set_text += `name = '${body.name}'`;
    }else if(body.type){
        set_text += `type = '${body.type}'`;
    }
    for (let i = 2; i < unit_columns.length; i++) {
        const element = unit_columns[i];
        if(set_text===''){
            set_text = `${element} = ${body[element]}`;
        }else if(body[element]){
            set_text = `, ${element} = ${body[element]}`;
        }
    }
    let sql_query = `UPDATE units SET ${set_text} WHERE id = ${body.id}`;

    try{
        let data = await db.con.query(sql_query);
        return {status: 'success'};
    }catch(error){
        console.log(error);
        context.throw(400, 'INVALID_DATA');
    }
}


module.exports = units;