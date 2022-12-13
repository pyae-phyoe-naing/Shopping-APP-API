const {
    decodeToken
} = require("./token");
const Redis = require('../utils/redis');

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            let result = schema.validate(req.body);
            if (result.error) {
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    validateParam: (schema, name) => {
        return (req, res, next) => {
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            let result = schema.validate(obj);
            if (result.error) {
                next(new Error(result.error.details[0].message));
                return;
            }
            next();
        }
    },
    validateToken: () => {
        return async (req, res, next) => {
            if (!req.headers.authorization) {
                next(new Error('Please First Login'));
                return;
            }
            let token = req.headers.authorization.split(' ')[1];
            try {
                let tokenUser = decodeToken(token);
                if (!tokenUser) {
                    next(new Error('Tokenization Error'));
                    return;
                }
                let user = await Redis.get(tokenUser._id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    next(new Error('Tokenization Error'));
                }
            } catch (error) {
                next(new Error('Tokenization Error'));
            }
            
        }
    },
    validateRole: (role) => {
        return async (req, res, next) => {
            let isRole = req.user.roles.find((ro) => ro.name == role);
            if (!isRole) {
                next(new Error('No Permission!'));
                return;
            }
            next();
        }
    },
    hasAnyRole: (roles) => {
        return async (req, res, next) => {
            let bol = false;
            for (let i = 0; i < roles.length; i++) {
                let hasRole = req.user.roles.find((ro) => ro.name === roles[i]);
                if (hasRole) {
                    bol = true;
                    break;
                }
            }
            if (bol) next();
            else next(new Error('You need at least one Role!'));
        }
    }
}