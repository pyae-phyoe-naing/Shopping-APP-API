const router = require('express').Router();
const controller = require('../controller/user');
const { UserSchema } = require('../utils/schema');
const { validateBody } = require('../utils/validator');

router.post('/register', [validateBody(UserSchema.register),controller.register]);

module.exports = router;