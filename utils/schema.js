const Joi = require('joi');

module.exports = {
    PermitSchema: {
        Add: Joi.object({
            name: Joi.string().required()
        })
    },
    RoleSchema: {
        Add: Joi.object({
            name: Joi.string().required()
        }),
        RoleAddPermit: Joi.object({
            permitID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            roleID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    UserSchema: {
        register: Joi.object({
            name: Joi.string().required().min(5),
            email: Joi.string().email().required(),
            phone: Joi.string().required().min(7).max(11),
            password: Joi.string().min(8).required()
        }),
        login: Joi.object({
            phone: Joi.string().required().min(7).max(11),
            password: Joi.string().min(8).required()
        }),
        UserAddRole: Joi.object({
            roleId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        }),
        UserAddPermit: Joi.object({
            permitId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    CatSchema: Joi.object({
        name: Joi.string().required()
    }),
    SubCatSchema: Joi.object({
        name: Joi.string().required(),
        catId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
    }),
    ChildCatSchema: Joi.object({
        name: Joi.string().required(),
        subcatId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
    }),
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}