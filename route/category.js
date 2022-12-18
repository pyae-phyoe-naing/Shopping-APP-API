const router = require('express').Router();
const controller = require('../controller/category');
const {
    CatSchema
} = require('../utils/schema');
const {
    validateBody, validateToken,hasAnyRole
} = require('../utils/validator');
const {
    saveFile
} = require('../utils/gallergy');

router.post('/', [validateToken(),hasAnyRole(['Admin','Manager']),validateBody(CatSchema), saveFile, controller.add]);

module.exports = router;