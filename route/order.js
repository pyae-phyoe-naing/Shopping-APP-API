const router = require('express').Router();
const controller = require('../controller/order');
const {
    validateToken,
    validateRole,
    validateParam
} = require('../utils/validator');
const {
    AllSchema
} = require('../utils/schema');

router.get('/', [validateToken(), validateRole('Admin'), controller.getAllOrders]);
router.get('/myOrder', [validateToken(), controller.getMyOrders]);
router.post('/', [validateToken(), controller.add]);

router.route('/:id')
    .delete([validateToken(), validateRole('Admin'), validateParam(AllSchema.id, 'id'), controller.deleteOrder]);

module.exports = router;