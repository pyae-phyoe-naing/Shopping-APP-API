const router = require('express').Router();
const controller = require('../controller/permit');
const {PermitSchema} = require('../utils/schema');
const { validateBody } = require('../utils/validator');

router.post('/', [validateBody(PermitSchema.Add), controller.add]);

module.exports = router;