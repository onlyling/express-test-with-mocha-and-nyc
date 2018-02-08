const {
    getPageDate
} = require('./utils');

/**
 * 对数据模型创建 分页查询 方法
 * @param {Object} instance 
 */

const createPager = (instance) => {
    instance.$pager = ({
        pageNo = 1,
        pageSize = 10,
        params = {},
        where = {},
        order = [
            ['createdAt', 'DESC']
        ]
    }) => {
        return new Promise((resolve, reject) => {
            instance
                .findAndCountAll({
                    where,
                    limit: pageSize,
                    offset: (pageNo - 1) * pageSize,
                    order,
                })
                .then((data) => {

                    delete params.pageNo;

                    let __data = getPageDate(data, pageNo, pageSize);
                    // let __urls = getPageUrls(params, pageNo, __data.totalPage);

                    // __data.urls = __urls;

                    resolve(__data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

/**
 * 对数据模型创建 删除 方法
 * @param {Object} instance 
 */
const createDelete = (instance) => {
    instance.$delete = (id) => {
        return new Promise((resolve, reject) => {
            instance
                .findOne({
                    where: {
                        id
                    }
                })
                .then((data) => {
                    if (data) {
                        resolve(data.destroy());
                    } else {
                        reject('删除失败，数据不存在');
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

/**
 * 对数据模型创建 修改 方法
 * @param {Object} instance 
 */
const createPut = (instance) => {
    instance.$put = (params) => {
        return new Promise((resolve, reject) => {
            instance
                .findOne({
                    where: {
                        id: params.id
                    }
                })
                .then((data) => {
                    if (data) {
                        resolve(data.update(params));
                    } else {
                        reject('修改失败，数据不存在');
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

/**
 * 对数据模型创建 新建 方法
 * @param {Object} instance 
 */
const createPost = (instance) => {
    instance.$post = (params) => {
        return instance.create(params);
    }
}

module.exports = {
    createPager,
    createDelete,
    createPut,
    createPost,
}