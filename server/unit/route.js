'use strict';

const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const unitModel = require('./model');
router.get('/all', async (context, next) =>{
    const sql_text = 'SELECT * FROM units ORDER BY name ASC;';
    try{
        const data = await unitModel.getAll();
        context.response.body = {units: data};
    }catch(error){
        console.log(error);
        context.throw(500, 'Server Error');
    }
});

router.get('/:term', async (context, next) => {
    try{
        const unit_data = await unitModel.getUnit(context.params.term);
        if(!unit_data){
            context.throw(422, 'No Unit Found')
        }
        context.response.body = unit_data;
        context.status = 200;
    }
    catch(error){
        console.log(error)
        context.throw(422, 'No Unit Found')
    }
});

router.post('/', async (context, next) =>{
    try{
        const data = unitModel.insertUnit(context.request.body);
        context.response.status = 204
    }catch(error){
        console.log(error);
        context.throw(422, 'Invalid Data');
    }
    
});

router.put('/:id', async (context, next) => {
    const body = context.request.body;
    const unit_id = context.params.id;
    if(!body){
        context.throw(422, 'No Parameters')
    }
    try{
        const data = unitModel.getUnitById(unit_id)
        if(data.length===0){
            context.throw(422, 'Invalid Unit Id')
        }
    }catch(error){
        console.log(error);
        context.throw(422, 'Invalid Unit Id')
    }
    
    try{
        await unitModel.modifyUnit(unit_id, body);
        context.status = 204
    }catch(error){
        console.log(error);
        context.throw(422, 'Update Failed')
    }
});


module.exports = router;