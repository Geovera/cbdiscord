const Router            = require('@koa/router');

const router            = new Router();
const membershipModel   = require('./model');
const userModel         = require('../../user/model');

const requestRouter    = require('./request/route');
router.use('/request', requestRouter.routes(), requestRouter.allowedMethods());

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
function hasHouse(context){
    if(!context.user.house_id){
        context.throw(400, 'No house');
    }
}
function checkPermissionsNoThrow(context, ROLE){
    return ROLE >= context.user.lk_permission_level;

}
// DELETE END

router.get('/permissions', async (context, next) => {
    if(!context.user.house_id || context.user.lk_permission_level === undefined){
        context.throw(400, 'No house');
    }
    try{
        context.response.status = 200;
        context.response.body   = context.user.lk_permission_level;
    }catch(error){
        console.log(error);
        context.throw(400, 'ERROR');
    }
});

router.post('/', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const body = context.request.body;
        if(!body || !body.user_id){
            throw Error('No user to accept');
        }
        await membershipModel.acceptRequest(body.user_id, context.user.house_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to Accept Request')
    }
});

router.put('/:member_id', async(context, next) => {
    hasHouse(context);
    const body = context.request.body;
    if(!body || !body.role){
        context.throw(400, 'Missing parameters')
    }
    try{
        const member = await userModel.getUserFullFromId(context.params.member_id);
        if(!member){
            throw Error('Member does not exists');
        }
        if(member.house_id !== context.user.house_id){
            throw Error('Not on the same house');
        }
        if(member.lk_permission_level <= context.user.lk_permission_level){
            throw Error('Member permission level is high')
        }
        if(checkPermissionsNoThrow(context, HOUSE_ROLES.lg)){
            if(body.role === 'lg'){
                await membershipModel.changeHouseLiege(context.user.id, member.id);
            }else{
                await membershipModel.modifyMemberRole(member.id, body.role);
            }
        }else{
            if(context.user.lk_house_role < HOUSE_ROLES[body.role]){
                await membershipModel.modifyMemberRole(member.id, body.role);
            }else{
                throw Error('Cannot modify to the same level');
            }
        }
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to modify role')
    }
});

router.delete('/', async (context, next) => {
    if(context.user.lk_house_role==='lg'){
        try{
            await membershipModel.deleteHouse(context.user.house_id, context.session.user_id);
            context.response.status = 204;
        }catch(error){
            console.log(error);
            context.throw(400, 'Unable to Delete House');
        }
    }else{
        try{
            await membershipModel.leaveHouse(context.session.user_id);
            context.response.status = 204;
        }catch(error){
            console.log(error);
            context.throw(400, 'Unable to Leave');
        }
    }
});

router.delete('/:user_id', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    if(context.params.user_id===context.session.user_id){
        context.throw(400, "Can't delete yourself");
    }
    try{
        const member = await userModel.getUserFullFromId(context.params.user_id);
        if(!member){
            throw Error('Member does not exists');
        }
        if(member.house_id !== context.user.house_id){
            throw Error('Not on the same house');
        }
        if(member.lk_permission_level <= context.user.lk_permission_level){
            throw Error("Member permission level is high")
        }
        await membershipModel.deleteMember(context.params.user_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to Delete Member')
    }
});

module.exports = router;