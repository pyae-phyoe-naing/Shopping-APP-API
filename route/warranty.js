const router = require('express').Router();
const controller = require('../controller/warranty');
const {
    validateToken,
    hasAnyRole,
    validateBody,
    validateParam
} = require('../utils/validator');
const {
    WarrantySchema,
    AllSchema
} = require('../utils/schema');


router.get('/', controller.all);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(WarrantySchema), controller.add]);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .delete([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), controller.drop])
    .patch([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), validateBody(WarrantySchema), controller.patch]);

module.exports = router;