const router = require('express').Router();
const controller = require('../controller/subcat');
const {
    saveFile
} = require('../utils/gallergy');
const {
    SubCatSchema,
    AllSchema
} = require('../utils/schema');
const {
    validateToken,
    hasAnyRole,
    validateBody,
    validateParam
} = require('../utils/validator');

router.get('/', controller.all);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(SubCatSchema), saveFile, controller.add]);

router.route('/:id')
    .get([validateParam(AllSchema.id,'id'),controller.get])
    .delete([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), controller.drop]);

module.exports = router;