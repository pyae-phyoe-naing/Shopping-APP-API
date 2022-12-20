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
    DeliverySchema: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        duration: Joi.string().required(),
        remark: Joi.optional()
    }),
    WarrantySchema: Joi.object({
        name: Joi.string().required(),
        remark: Joi.optional()
    }),
    ProductSchema: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        brand: Joi.string().required(),
        cat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        subcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        childcat: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        tag: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        discount: Joi.number().optional(),
        features: Joi.string().required(),
        description: Joi.string().required(),
        detail: Joi.string().required(),
        status: Joi.boolean().optional(),
        delivery: Joi.string().required(),
        warranty: Joi.string().required(),
        colors: Joi.string().required(),
        size: Joi.string().required(),
        rating: Joi.string().optional()
    }),
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }),
        page: Joi.object({
            page:Joi.number().optional()
        })
    }
}