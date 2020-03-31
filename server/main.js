'use strict';

const Koa = require('koa');
const bodyParser = require('koa-body');

const auth = require('./util/auth');
const unitsRouter = require('./routes/units');
const app = new Koa();

app.use(bodyParser());
app.use(auth());

app.use(unitsRouter.routes()).use(unitsRouter.allowedMethods());

app.listen(3000, () => console.log('Server Started'));