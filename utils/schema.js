const Joi = require('joi');

module.exports = {
    PermitSchema: {
        Add: Joi.object({
            name: Joi.string().required()
        })
    },
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}