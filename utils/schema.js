const Joi = require('joi');

module.exports = {
    PermitSchema: {
        Add: Joi.object({
            name: Joi.string().required()
        })
    },
    RoleSchema: {
        Add: Joi.object({
            name : Joi.string().required()
        }),
        RoleAddPermit: Joi.object({
            permitID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
            roleID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/)
        })
    },
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}