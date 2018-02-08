const router = require('express').Router();

router
    .get('/', async (req, res, next) => {
        let {
            query: params,
            Models,
        } = req;

        let id = params.id;
        let instance = await Models.merchant.$findById(id);

        if (instance) {
            res.$apiSuccess(instance);
        } else {
            res.$apiError('无数据');
        }
    })
    .get('/all', async (req, res, next) => {
        let {
            Models,
        } = req;

        let data = await Models.merchant.findAll({
            attributes: {
                exclude: ['password']
            },
            include: [{
                as: 'tags',
                model: Models.merchantTag,
                through: {
                    attributes: [],
                },
            }],
        });

        res.$apiSuccess(data);
    })
    .get('/list', async (req, res, next) => {
        let {
            query: params,
            Models
        } = req;

        let {
            pageNo = 1,
                pageSize = 10,
        } = params;

        let data = await Models.merchant.$pager(pageNo, pageSize, params);

        res.$apiSuccess(data);

    })

module.exports = router;