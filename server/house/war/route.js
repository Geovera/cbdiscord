const Router        = require('@koa/router');
const CronJob       = require('cron').CronJob;

const router        = new Router();
const authRouter    = new Router();
const warModel      = require('./model');

const participationRouter = require('./participation/route');
authRouter.use('/participation', participationRouter.routes(), participationRouter.allowedMethods());

router.get('/', async (context, next) => {
    try{
        const data = await warModel.getCurrentWar();
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
        await warModel.insertNewWar();
        console.log('Inserted new War')
    }catch(error){
        console.log(error);
    }
}

const war_job = new CronJob('30 22 * * Tue,Sat', ()=> {
    insertNewWar();
});
//     war_job.start();

module.exports = [router, authRouter];