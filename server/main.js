'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-body');
const session = require('koa-session')
const serve = require('koa-static');
const logger = require('koa-logger')

const getUser = require('./user/model');
const [userRouter, userAuthRouter] = require('./user/route');
const unitRouter = require('./unit/route');
const SESS_CONFIG = require('./session_config');
const ENV = require('./settings')
const app = new Koa();
const router = new Router();
const authRouter = new Router();

app.use(serve(`${__dirname}/../web`))
app.use(logger())

app.keys = [ENV.SESS_KEY]
app.use(bodyParser());
app.use(session(SESS_CONFIG, app));

router.use('/unit', unitRouter.routes(), unitRouter.allowedMethods());
router.use('/user', userRouter.routes(), userRouter.allowedMethods());

authRouter.use('/user', userAuthRouter.routes(), userAuthRouter.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());

// Make sure user is authorized
app.use(async (context, next) => {
    if(context.session.user_id){
        await next();
        console.log(context.status)
    } else {
        context.response.status = 401;
    }
});
// Add user to context
app.use(async (context, next) => {
    const user = getUser.getUserFromId(context.session.user_id);
    if(user){
        context.user = user;
        await next();
    } else {
        context.response.status = 403;
    }
});

app.use(authRouter.routes()).use(authRouter.allowedMethods());

app.listen(3000, () => console.log('Server Started'));