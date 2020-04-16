'use strict';

const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const unitsModel = require('./model');
router.get('/all', unitsModel.getAll);

router.get('/:term', unitsModel.getUnit);

router.post('/', unitsModel.insertUnit);

router.put('/:id', unitsModel.modifyUnit);


module.exports = router;