const bcrypt = require('bcryptjs');
module.exports = {
    encode: payload => bcrypt.hashSync(payload),
    comparePass : (plain,hash) => bcrypt.compareSync(plain,hash),
    responseMsg: (res, con, msg, result = []) => {
        res.status(200).json({
            con,
            msg,
            result
        });
    }
}