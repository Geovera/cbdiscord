const Koa           = require('koa');
const Router        = require('@koa/router');
const CronJob       = require('cron').CronJob;

const router        = new Router();
const authRouter    = new Router();
const houseModel    = require('./model');

const userModel     = require('../user/model');

const HOUSE_ROLES = {
    lg: 0,
    sen: 1,
    mar: 2,
    nob: 3,
    tre: 4,
    kng: 5
}

function checkPermissions(context, ROLE){
    if(ROLE < context.user.lk_permission_level){
        context.throw(403, "No Permissions")
    }
}
function checkPermissionsNoThrow(context, ROLE){
    return ROLE >= context.user.lk_permission_level;

}
function checkHouse(context){
    const house_id = context.user.house_id ? context.user.house_id : context.request.body.house_id;

    if(!house_id || house_id!==context.user.house_id){
        context.throw(403, "Not your House");
    }
}
function hasHouse(context){
    if(!context.user.house_id){
        context.throw(400, 'No house');
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

authRouter.get('/members', async(context, next) => {
    hasHouse(context);
    try{
        const data = await houseModel.getMembers(context.user.house_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, "Failed to get members")
    }
});

authRouter.get('/member-units/:member_id', async(context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const data = await houseModel.getMemberUnits(context.params.member_id);
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw('Failed to get Member Units');
    }
});

authRouter.post('/modify-role', async(context, next) => {
    hasHouse(context);
    const body = context.request.body;
    if(!body || !body.member_id || !body.role){
        context.throw(400, 'Missing parameters')
    }
    try{
        const member = await userModel.getUserFullFromId(body.member_id);
        if(!member){
            throw Error('Member does not exists');
        }
        if(member.house_id !== context.user.house_id){
            throw Error('Not on the same house');
        }
        if(member.lk_permission_level <= context.user.lk_permission_level){
            throw Error("Member permission level is high")
        }
        if(checkPermissionsNoThrow(context, HOUSE_ROLES.lg)){
            if(body.role === 'lg'){
                await houseModel.changeHouseLiege(context.user.id, member.id);
            }else{
                await houseModel.modifyMemberRole(member.id, body.role);
            }
        }else{
            if(context.user.lk_house_role < HOUSE_ROLES[body.role]){
                await houseModel.modifyHouse(member.id, body.role);
            }else{
                throw Error("Can't modify to the same level");
            }
        }
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to modify role')
    }
})

authRouter.get('/my-permission', async(context, next) => {
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

authRouter.get('/requests', async (context, next) => {
    // checkHouse(context);
    checkPermissions(context, HOUSE_ROLES.sen);
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
    checkPermissions(context, HOUSE_ROLES.sen);
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

authRouter.delete('/reject-request/:user_id', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.sen);
    try{
        const body = context.request.body;
        if(!context.params.user_id){
            throw Error("No user to refuse");
        }
        await houseModel.rejectRequest(context.params.user_id, context.user.house_id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Unable to reject Request')
    }
});

authRouter.delete('/delete-member/:user_id', async (context, next) => {
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

authRouter.get('/', async (context, next) => {
    hasHouse(context);
    try{
        const data = await houseModel.getHouse(context.user.house_id);
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

authRouter.put('/', async (context, next) => {
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

authRouter.delete('/', async (context, next) => {
    checkPermissions(context, HOUSE_ROLES.LIEGE);
    try{
        await houseModel.deleteHouse(context.user.house_id, context.user.id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, "Unable to Delete");
    }
});

authRouter.get('/participation', async (context, next) => {
    hasHouse(context);
    try{
        const war = await houseModel.getCurrentWar();
        if(!war){
            throw Error('Failed to get Current War');
        }
        const participation = await houseModel.getParticipation(context.user.house_id);
        context.response.status = 200;
        context.response.body = {war: war, participation: participation};
    }catch(error){
        console.log(error);
        context.throw('Failed to get Participation');
    }
});

authRouter.post('/participation', async (context, next) => {
    hasHouse(context);
    const body = context.request.body;
    if(!body || !body.decision){
        context.throw(400, 'No decision found');
    }
    try{
        await houseModel.warParticipation(context.user.id, context.user.house_id, body.decision);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to Update Participation');
    }
});

router.get('/current-war', async (context, next) => {
    try{
        const data = await houseModel.getCurrentWar();
        if(!data){
            throw Error('Failed to get Current War');
        }
        context.response.status = 200;
        context.response.body = data;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to get Current War');
    }
});

async function insertNewWar(){
    try{
        await houseModel.insertNewWar();
        console.log('Inserted new War')
    }catch(error){
        console.log(error);
    }
}

const war_job = new CronJob('30 22 * * Tue,Sat', ()=> {
    insertNewWar();
});
war_job.start();


module.exports = [router, authRouter];