const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const usersModel = require('../models/users');

router.get('/user/:id', usersModel.getUser);

module.exports = router;