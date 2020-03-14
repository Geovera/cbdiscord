const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const usersModel = require('../models/users');

router.get('/user/:id', (context, next)=>{
    
})

module.exports = router;