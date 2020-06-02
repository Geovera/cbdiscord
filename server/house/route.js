const Router        = require('@koa/router');

const router        = new Router();
const authRouter    = new Router();
const houseModel    = require('./model');

const userModel     = require('../user/model');

const membershipRouter              = require('./membership/route');
authRouter.use('/membership',       membershipRouter.routes(),  membershipRouter.allowedMethods());

const memberRouter                  = require('./member/route');
authRouter.use('/member',           memberRouter.routes(),      memberRouter.allowedMethods());

const [warRouter, warAuthRouter]    = require('./war/route');
router.use('/war',                  warRouter.routes(),         warRouter.allowedMethods());
authRouter.use('/war',              warAuthRouter.routes(),     warAuthRouter.allowedMethods());

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
function hasHouseNoThrow(context){
    return context.user.house_id;
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
    checkPermissions(context, HOUSE_ROLES.lg)
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
    hasHouse(context);
    checkPermissions(context, HOUSE_ROLES.lg);
    console.log('asd')
    try{
        await houseModel.deleteHouse(context.user.house_id, context.user.id);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, "Unable to Delete");
    }
});

module.exports = [router, authRouter];