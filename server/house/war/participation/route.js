const Router                = require('@koa/router');

const router                = new Router();
const participationModel    = require('./model');

// DELETE WHEN CHANGING MODEL
function hasHouse(context){
    if(!context.user.house_id){
        context.throw(400, 'No house');
    }
}

router.get('/reminder', async (context, next) => {
    await participationModel.getReminder(context);
});

router.get('/', async (context, next) => {
    await participationModel.getWarParticipation(context, 0);
});

router.get('/:option', async (context, next) => {
    await participationModel.getWarParticipation(context, context.params.option);
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