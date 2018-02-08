module.exports = (req, res, next) => {

    res.$apiSuccess = (data, success = true) => {
        let __data = {
            success
        }

        if (typeof data === 'object') {
            __data.data = data;
        } else {
            __data.msg = data;
        }

        res.json(__data);
    }

    res.$apiError = (err, success = false) => {
        let __data = {
            success
        }

        if (typeof err === 'object') {
            __data.msg = JSON.stringify(err);
        } else {
            __data.msg = err;
        }

        res.json(__data);
    }

    next();

}