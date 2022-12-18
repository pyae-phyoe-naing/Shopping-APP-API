const router = require('express').Router();
const controller = require('../controller/subcat');
const { saveFile } = require('../utils/gallergy');
const { SubCatSchema } = require('../utils/schema');
const { validateToken, hasAnyRole, validateBody } = require('../utils/validator');

router.get('/', controller.all);
router.post('/',[validateToken(),hasAnyRole(['Admin','Manager']),validateBody(SubCatSchema),saveFile,controller.add])

module.exports = router;