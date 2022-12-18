const router = require('express').Router();
const controller = require('../controller/category');
const {
    CatSchema, AllSchema
} = require('../utils/schema');
const {
    validateBody,
    validateToken,
    hasAnyRole,
    validateParam
} = require('../utils/validator');
const {
    saveFile
} = require('../utils/gallergy');

router.get('/', [controller.all]);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(CatSchema), saveFile, controller.add]);
router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .delete([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), controller.drop]);
module.exports = router;