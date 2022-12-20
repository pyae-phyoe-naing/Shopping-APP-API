const bcrypt = require('bcryptjs');
module.exports = {
    encode: payload => bcrypt.hashSync(payload),
    comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),
    responseMsg: (res, con, msg, result = []) => {
        res.status(200).json({
            con,
            msg,
            result
        });
    },
    strCollect: (text) => text.split(' ').join('').toLowerCase(),
    aa: (str) => str.charAt(0).toUpperCase() + str.slice(1),
    firstWordUpperCase: (text) => text.split(' ').map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join(' '),
}