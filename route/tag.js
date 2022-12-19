const router = require('express').Router();
const controller = require('../controller/tag');
const {
    validateToken,
    hasAnyRole,
    validateBody,
    validateParam
} = require('../utils/validator');
const {
    CatSchema,
    AllSchema
} = require('../utils/schema');
const {
    saveFile,
    updateFile
} = require('../utils/gallergy');

router.get('/', controller.all);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(CatSchema), saveFile, controller.add]);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .delete([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), controller.drop])
    .patch([validateToken(), hasAnyRole(['Admin', 'Manager']), validateParam(AllSchema.id, 'id'), validateBody(CatSchema), updateFile, controller.patch]);

module.exports = router;