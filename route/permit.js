const router = require('express').Router();
const controller = require('../controller/permit');
const {PermitSchema,AllSchema} = require('../utils/schema');
const { validateBody ,validateParam} = require('../utils/validator');

router.get('/',  controller.all);
router.post('/', [validateBody(PermitSchema.Add), controller.add]);
router.route('/:id')
    .get([validateParam(AllSchema.id,'id'),controller.get]);
module.exports = router;