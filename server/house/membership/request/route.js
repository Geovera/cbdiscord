const Router            = require('@koa/router');

const router            = new Router();
const requestModel     = require('./model');


// DELETE START
const HOUSE_ROLES = {
    lg: 0,
    sen: 1,
    mar: 2,
    nob: 3,
    tre: 4,
    kng: 5
}

function checkPermissions(context, ROLE){
    if(!hasHouseNoThrow(context) || ROLE < context.user.lk_permission_level){
        context.throw(403, "No Permissions")
    }
}
function hasHouseNoThrow(context){
    return context.user.house_id;
}
// DELETE END

router.get('/all', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const data = await requestModel.getHouseRequests(context.user.house_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to get requests');
    }
});

router.post('/', async (context, next) => {
    if(context.user.house_id){
        context.throw(400, 'Already in a house')
    }
    try{
        const body = context.request.body;
        if(!body || !body.house_id){
            throw Error('No house ID');
        }
        await requestModel.sendRequest(body.house_id, context.session.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to send request');
    }
});

router.delete('/', async (context, next) =>{
    if(context.user.house_id){
        context.throw(400, 'Already in a house')
    }
    try{
        await requestModel.cancelRequests(context.session.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to send request');
    }
});

router.delete('/:user_id', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const body = context.request.body;
        if(!context.params.user_id){
            throw Error("No user to refuse");
        }
        await requestModel.rejectRequest(context.params.user_id, context.user.house_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to reject Request')
    }
});

module.exports = router;