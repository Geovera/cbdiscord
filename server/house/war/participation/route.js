const Router                = require('@koa/router');

const router                = new Router();
const participationModel    = require('./model');

// DELETE WHEN CHANGING MODEL
function hasHouse(context){
    if(!context.user.house_id){
        context.throw(400, 'No house');
    }
}

router.get('/', async (context, next) => {
    hasHouse(context);
    try{
        const war = await participationModel.getCurrentWar();
        if(!war){
            throw Error('Failed to get Current War');
        }
        const participation = await participationModel.getParticipation(context.user.house_id);
        context.response.status = 200;
        context.response.body = {war: war, participation: participation};
    }catch(error){
        console.log(error);
        context.throw('Failed to get Participation');
    }
});

router.post('/', async (context, next) => {
    hasHouse(context);
    const body = context.request.body;
    if(!body || !body.decision){
        context.throw(400, 'No decision found');
    }
    try{
        await participationModel.warParticipation(context.user.id, context.user.house_id, body.decision);
        context.response.status = 204;
    }catch(error){
        console.log(error);
        context.throw(400, 'Failed to Update Participation');
    }
});

module.exports = router;