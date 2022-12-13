const router = require('express').Router();
const controller = require('../controller/user');
const { UserSchema } = require('../utils/schema');
const { validateBody, validateToken, validateRole } = require('../utils/validator');

router.post('/register', [validateBody(UserSchema.register), controller.register]);
router.post('/login', [validateBody(UserSchema.login), controller.login]);
router.post('/add/role', [validateToken(), validateRole('Admin'), validateBody(UserSchema.UserAddRole), controller.addRole]);
router.post('/remove/role', [validateToken(), validateRole('Admin'), validateBody(UserSchema.UserAddRole), controller.removeRole]);

module.exports = router;