'use strict';

const Koa = require('koa');
const Router = require('@koa/router');

const router = new Router();
const unitsModel = require('../models/units');
router.get('/unit/all', unitsModel.getAll);

router.get('/unit/id/:id', unitsModel.getUnitById);

router.get('/unit/name/:name', unitsModel.getUnitByName);

router.post('/unit/insert', unitsModel.insertUnit);

router.post('/unit/modify', unitsModel.modifyUnit);


module.exports = router;