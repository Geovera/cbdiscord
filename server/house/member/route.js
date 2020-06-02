const Router        = require('@koa/router');

const router        = new Router();
const memberModel   = require('./model');

// DELETE
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
// END DELETE

router.get('/all', async (context, next) => {
    hasHouse(context);
    try{
        const data = await memberModel.getMembers(context.user.house_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, "Failed to get members")
    }
});

router.get('/:member_id/units', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const data = await memberModel.getMemberUnits(context.params.member_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw('Failed to get Member Units');
    }
});


module.exports = router;