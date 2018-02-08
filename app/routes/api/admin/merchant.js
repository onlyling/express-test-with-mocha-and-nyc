const router = require('express').Router();

router.route('/')
    .post(async (req, res, next) => {
        let {
            body: params,
            Models,
        } = req;

        let data = await Models.merchant.$post(params);

        res.$apiSuccess(data);
    })
    .put(async (req, res, next) => {
        let {
            body: params,
            Models,
        } = req;
        
        let data = await Models.merchant.$put(params);

        res.$apiSuccess(data);
    })
    .delete(async (req, res, next) => {
        let {
            query: params,
            Models
        } = req;

        await Models.$delete(params.id);

        res.$apiSuccess('已删除');
    })

module.exports = router;