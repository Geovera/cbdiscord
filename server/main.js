'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-body');
const session = require('koa-session')

const userRouter = require('./user/route');
const unitRouter = require('./unit/route');
const SESS_CONFIG = require('./session_config');
const ENV = require('./settings')
const app = new Koa();
const router = new Router();

app.keys = [ENV.SESS_KEY]
app.use(bodyParser());
app.use(session(SESS_CONFIG, app));

router.use('/unit', unitRouter.routes(), unitRouter.allowedMethods());
router.use('/user', userRouter.routes(), userRouter.allowedMethods());

//app.use(auth());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started'));