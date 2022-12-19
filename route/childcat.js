const router = require('express').Router();
const controller = require('../controller/childcat');
const {
    validateToken,
    hasAnyRole,
    validateBody,
    validateParam
} = require('../utils/validator');
const {
    ChildCatSchema, AllSchema
} = require('../utils/schema');
const {
    saveFile
} = require('../utils/gallergy');

router.get('/', controller.all);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(ChildCatSchema), saveFile, controller.add]);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .delete([validateToken(),hasAnyRole(['Admin','Manager']),validateParam(AllSchema.id,'id'),controller.drop]);

module.exports = router;