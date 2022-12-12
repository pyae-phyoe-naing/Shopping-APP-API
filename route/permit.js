const router = require('express').Router();
const controller = require('../controller/permit');
const {PermitSchema,AllSchema} = require('../utils/schema');
const { validateBody ,validateParam, validateToken} = require('../utils/validator');

router.get('/',  controller.all);
router.post('/', [validateToken(),validateBody(PermitSchema.Add), controller.add]);
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .patch([validateParam(AllSchema.id, 'id'), validateBody(PermitSchema.Add), controller.patch])
    .delete([validateParam(AllSchema.id, 'id'), controller.drop]);
    
module.exports = router;