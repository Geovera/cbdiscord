const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const authRouter = new Router();
const houseModel = require('./model');

const HOUSE_ROLES = {
    LIEGE: 0,
    SEN: 1,
    MAR: 2,
    NOB: 3,
    TRE: 4,
    KNG: 5
}

function checkPermissions(context, ROLE){
    if(ROLE < context.user.lk_permission_level){
        context.throw(403, "No Permissions")
    }
}
function checkHouse(context){
    const house_id = context.user.house_id ? context.user.house_id : context.request.body.house_id;

    if(!house_id || house_id!==context.user.house_id){
        context.throw(403, "Not your House");
    }
}

router.get('/all', async (context, next) => {
    try{
        const data = await houseModel.getAll();
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to get houses');
    }
});

authRouter.get('/has-house', async (context, next) => {
    try{
        if(context.user.house_id){
            context.response.body = true;
        }else{
            context.response.body = false;
        }
        context.response.status = 200;
    }catch(error){
        console.log(error);
        context.throw(400, 'ERROR');
    }
})

authRouter.post('/request', async (context, next) => {
    if(context.user.house_id){
        context.throw(400, 'Already in a house')
    }
    try{
        const body = context.request.body;
        if(!body || !body.house_id){
            throw Error('No house ID');
        }
        await houseModel.sendRequest(body.house_id, context.session.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to send request');
    }
});

authRouter.delete('/request', async (context, next) => {
    if(context.user.house_id){
        context.throw(400, 'Already in a house')
    }
    try{
        await houseModel.cancelRequests(context.session.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to send request');
    }
});

authRouter.get('/requests/:house_id', async (context, next) => {
    checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.SEN);
    try{
        const data = await houseModel.getHouseRequests(context.user.house_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to get requests');
    }
});

authRouter.post('/accept-request', async (context, next) => {
    checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.SEN);
    try{
        const body = context.request.body;
        if(!body || !body.user_id){
            throw Error("No user to accept");
        }
        await houseModel.acceptRequest(body.user_id, context.user.house_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to Accept Request')
    }
});

authRouter.delete('/refuse-request', async (context, next) => {
    checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.SEN);
    try{
        const body = context.request.body;
        if(!body || !body.user_id){
            throw Error("No user to refuse");
        }
        await houseModel.refuseRequest(body.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to Accept Request')
    }
});

authRouter.delete('/delete-member/:user_id', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.SEN);
    if(context.params.user_id===context.session.user_id){
        context.throw(400, "Can't delete yourself");
    }
    try{
        await houseModel.deleteMember(context.params.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to Delete Member')
    }
});

authRouter.delete('/leave-house', async (context, next) => {
    if(context.user.lk_house_role==='lg'){
        try{
            console.log('asd')
            await houseModel.deleteHouse(context.user.house_id, context.session.user_id);
            context.response.status = 204;
        }catch(error){
            console.log(error);
            context.throw(400, 'Unable to Delete House');
        }
    }else{
        try{
            await houseModel.leaveHouse(context.session.user_id);
            context.response.status = 204;
        }catch(error){
            console.log(error);
            context.throw(400, 'Unable to Leave');
        }
    }
});

router.get('/', async (context, next) => {
    try{
        const data = await houseModel.getHouse();
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to get house');
    }
});

authRouter.post('/', async (context, next) => {
    try{
        if(context.user.house_id!==null){
            context.throw(400, "Can't create house when belonging to one")
        }
        const body = context.request.body;
        if(!body || !body.house_name){
            throw Error('No house_name')
        }
        await houseModel.insertHouse(body, context.session.user_id)

        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(422, "Couldn't Insert House")
    }
});

authRouter.put('/:house_id', async (context, next) => {
    checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.LIEGE)
    try{
        const body = context.request.body;
        if(!body){
            throw Error('No params')
        }
        await houseModel.modifyHouse(context.user.house_id, body);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, "ERROR")
    }
});

authRouter.delete('/:house_id', async (context, next) => {
    checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.LIEGE);
    try{
        await houseModel.deleteHouse(context.params.house_id, context.user.id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, "Unable to Delete");
    }
});


module.exports = [router, authRouter];