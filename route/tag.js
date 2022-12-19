const router = require('express').Router();
const controller = require('../controller/tag');
const {
    validateToken,
    hasAnyRole,
    validateBody
} = require('../utils/validator');
const {
    CatSchema
} = require('../utils/schema');
const {
    saveFile
} = require('../utils/gallergy');

router.get('/', controller.all);
router.post('/', [validateToken(),hasAnyRole(['Admin','Manager']),validateBody(CatSchema),saveFile,controller.add]);

module.exports = router;