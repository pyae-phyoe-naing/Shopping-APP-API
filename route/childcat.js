const router = require('express').Router();
const controller = require('../controller/childcat');

router.get('/',controller.all);

module.exports = router;