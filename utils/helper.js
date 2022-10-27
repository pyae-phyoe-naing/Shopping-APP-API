
module.exports = {
     responseMsg : (res, con, msg, result = []) => {
        res.status(200).json({
            con,
            msg,
            result
        });
    }
}