const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const unitsModel = require('../models/units');
router.get('/unit/all', async (context, next) => {
    
    let data = await unitsModel.getAll(context);
    context.response.body = data;

});
router.get('/unit/:id', async (context, next) => {
    
    let data = await unitsModel.getUnit(context, context.params.id);
    context.response.body = data;

});

router.post('/unit/insert', async (context, next)=>{
    let data = await unitsModel.insertUnit(context, context.request.body);
    context.response.body = data;
});

router.post('/unit/modify', async (context, next)=>{
    let data = await unitsModel.modifyUnit(context, context.request.body);
    context.response.body = data;
});


module.exports = router;