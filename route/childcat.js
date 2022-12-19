const router = require('express').Router();
const controller = require('../controller/childcat');
const {
    validateToken,
    hasAnyRole,
    validateBody
} = require('../utils/validator');
const {
    ChildCatSchema
} = require('../utils/schema');
const {
    saveFile
} = require('../utils/gallergy');

router.get('/', controller.all);
router.post('/', [validateToken(), hasAnyRole(['Admin', 'Manager']), validateBody(ChildCatSchema), saveFile, controller.add]);

module.exports = router;