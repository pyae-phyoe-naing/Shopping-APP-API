const router = require('express').Router();
const controller = require('../controller/product');
const {
    saveFiles
} = require('../utils/gallergy');
const {
    ProductSchema,
    AllSchema
} = require('../utils/schema');
const {
    validateToken,
    hasAnyRole,
    validateBody,
    validateParam
} = require('../utils/validator');

router.get('/all/:page?', validateParam(AllSchema.page, 'page'), controller.paginate);
router.post('/', [validateToken(), hasAnyRole(['Admin']), validateBody(ProductSchema), saveFiles, controller.add]);

router.get('/:type/:id/:page?',validateParam(AllSchema.type,'type'),validateParam(AllSchema.id, 'id'), validateParam(AllSchema.page, 'page'), controller.filteByType);

router.route('/:id')
    .get([validateParam(AllSchema.id, 'id'), controller.get])
    .delete([validateToken(), hasAnyRole(['Admin']), validateParam(AllSchema.id, 'id'), controller.drop])
    .patch([validateToken(), hasAnyRole(['Admin']), validateParam(AllSchema.id, 'id'),validateBody(ProductSchema),saveFiles,controller.patch]);

module.exports = router;