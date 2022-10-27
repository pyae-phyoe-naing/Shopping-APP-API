const Joi = require('joi');

module.exports = {
    PermitSchema: {
        Add: Joi.object({
            name : Joi.string().required()
        })
    }
}