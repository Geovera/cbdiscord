'use strict';

const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const authRouter = new Router();
const userModel = require('./model');

router.post('/d-login', async (context, next) =>{
    if(context.session.user_id && userModel.getUserFromId(context.session.user_id)){
        context.throw(400, 'User is Already Logged In')
    }
    const body = context.request.body;
    if(!body || !body.discordId){
        context.throw(422, 'No Discord Id');
    }

    try{
        const user = await userModel.getUserFromDiscord(body.discordId);
        if(!user){
            throw Error('No user found')
        }
        context.session.user_id = user.id;
        context.status = 204;
    }catch(error){
        console.log(error);
        context.throw(422, 'Login Failed')
    }
});

router.post('/login', async (context, next) =>{
    if(context.session.user_id && userModel.getUserFromId(context.session.user_id)){
        context.throw(400, 'User is Already Logged In')
    }
    const body = context.request.body;
    if(!body || !body.username || !body.password){
        context.throw(422, 'Missing parameters');
    }

    try{
        const user = await userModel.loginUser(body.username, body.password);
        if(!user){
            throw Error('No user found')
        }
        context.session.user_id = user.id;
        context.response.body = {username: user.username};
        context.status = 200;
    }catch(error){
        console.log(error);
        context.throw(422, 'Login Failed')
    }
});

router.post('/register', async(context, next)=>{
    const body = context.request.body;
    if(!body || !body.username || !body.password){
        context.throw(422, 'Missing parameters');
    }
    try{
        await userModel.registerUser(body.username, body.password);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to register user')
    }
})


router.post('/discord-register', async(context, next) =>{
    const body = context.request.body;
    console.log(body)
    if(!body || !body.discordId){
        context.throw(422, 'No Discord Id')
    }
    const discord_id = body.discordId;
    if(context.user && !context.user.discord_id){
        try{
            await userModel.addDiscordIdToUser(context.user.id, discord_id);
            context.status = 204;
            return;
        }catch(error){
            console.log(error);
            context.throw(422, 'Invalid Discord Id')
        }
    }

    let user = undefined;
    try{
        user = await userModel.getUserFromDiscord(discord_id);
    }catch(error){
        console.log(error);
        context.throw(422, 'Invalid Discord Id')
    }
    if(!user){
        if(!body.username || !body.password){
            context.throw(422, 'Missing parameters')
        }
        try{
            await userModel.createUserWithDiscord(discord_id, body.username, body.password);
            context.status = 204;
        }catch(error){
            context.throw(422, 'Failed to create user with Discord Id')
        }
    }else{
        context.throw(422, 'User already exists')
    }
});

authRouter.get('/units', async (context, next) => {
    try{
        const data = await userModel.getUserUnits(context.session.user_id);
        if(data.length===1  && data[0].id===null){
            throw Error('No Units Found')
        }
        context.response.body = data;
        context.status = 200;
    }catch(error){
        console.log(error)
        context.throw(400, 'No Units Found');
    }
});

authRouter.get('/units-inverse', async (context, next) => {
    try{
        const data = await userModel.getUserUnitsInverse(context.session.user_id);
        if(data.length===1  && data[0].id===null){
            throw Error('No Units Found')
        }
        context.response.body = data;
        context.status = 200;
    }catch(error){
        console.log(error)
        context.throw(400, 'No Units Found');
    }
});

authRouter.get('/unit/:term', async (context, next) =>{
    try{
        const data = await userModel.getUserUnit(context.session.user_id, context.params.term)
        context.response.body = data;
        context.status = 200;
    }catch(error){
        console.log(error)
        context.throw(422, 'No Unit Found')
    }
})

authRouter.post('/unit', async (context, next) => {
    try{
        const body = context.request.body;
        if(!body.unit_id){
            throw Error('No Unit Id To assign')
        }
        await userModel.assignUserUnit(context.session.user_id, body.unit_id, body);
        context.status = 204;
    }catch(error){
        console.log(error);
        if(error.errno===1062){
            context.throw(422, 'Unit is already assigned')
        }
        context.throw(400, 'Could Not Assign Unit')
    }
})

authRouter.put('/unit/:unit_id', async (context, next) =>{
    try{
        const body = context.request.body;
        if(!body){
            throw Error('No Data to Modify')
        }
        await userModel.modifyUserUnit(context.session.user_id, context.params.unit_id, body);
        context.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Could Not Modify Unit')
    }
})

authRouter.delete('/unit/:unit_id', async (context, next) =>{
    try{
        await userModel.deleteUserUnit(context.session.user_id, context.params.unit_id);
        context.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Could Not Unassign Unit')
    }
})


module.exports = [router, authRouter];