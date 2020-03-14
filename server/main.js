const Koa = require('koa');
const bodyParser = require('koa-body');

const unitsRouter = require('./routes/units');
const app = new Koa();

app.use(bodyParser());

app.use(unitsRouter.routes()).use(unitsRouter.allowedMethods());

app.listen(3000, () => console.log('Server Started'));