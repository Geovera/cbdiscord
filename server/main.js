'use strict';

const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-body');

const auth = require('./util/auth');
const unitsRouter = require('./unit/route');
const app = new Koa();
const router = new Router();

router.use('/unit', unitsRouter.routes(), unitsRouter.allowedMethods());

app.use(bodyParser());
//app.use(auth());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Server Started'));