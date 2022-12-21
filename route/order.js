const router = require('express').Router();
const controller = require('../controller/order');
const {validateToken, validateRole} = require('../utils/validator');

router.get('/', [validateToken(), validateRole('Admin'), controller.getAllOrders]);
router.get('/myOrder', [validateToken(), controller.getMyOrders]);
router.post('/', [validateToken(), controller.add]);

module.exports = router;