const {
    createPager,
    createDelete,
} = require('../lib/model-utils');

const {
    string2array,
    doEncryptBySHA1,
    isPassWord,
    getPageDate,
} = require('../lib/utils');

module.exports = (sequelize, DataTypes) => {

    let instance = sequelize.define('merchant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[\u4e00-\u9fa5]+$/g,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tel: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                not: /[^0-9\-]/g,
            },
        },
        keywords: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {},
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {},
        },
    }, {
        freezeTableName: true,
        tableName: 'merchant',
    });

    instance.associate = (models) => {

        // 多对多
        instance.belongsToMany(models.merchantTag, {
            through: 'merchant_2_tag',
            as: 'tags',
        });

        createDelete(instance);

        /**
         * 通过 id 查找具体数据
         * @param {Number|String} id 
         */
        let instanceFindById = (id) => {
            return instance.findById(id, {
                attributes: {
                    exclude: ['password']
                },
                include: [{
                    as: 'tags',
                    model: models.merchantTag,
                    through: {
                        attributes: [],
                    },
                }],
            });
        }

        /**
         * 通过 id 查找 tag 实例数据
         * @param {String} tagIds 
         */
        let getTagInstancesByIds = async (tagIds) => {
            let tags = string2array(tagIds).map((id) => {
                return models.merchantTag.findOne({
                    where: {
                        id
                    }
                });
            });

            let data = await Promise.all(tags);

            return data.filter((ii) => !!ii);
        }

        /**
         * 创建数据
         * @param {Object} params 
         */
        instance.$post = (params) => {
            return new Promise(async (resolve, reject) => {

                // 清空 ID
                delete params['id'];

                // 检验密码
                if (!!!params.password || !isPassWord(params.password)) {
                    return reject('密码格式为：16~20位大小写字母、数字、~!@#$%^_+=-,.');
                }

                // 查找相同的 name 是否重名
                let sameNameInstance = await instance.findOne({
                    where: {
                        name: params.name
                    }
                });

                if (sameNameInstance) {
                    return reject('该商家名称已存在');
                }

                // 加密密码
                params.password = doEncryptBySHA1(params.password);

                let newInstance = await instance.create(params);
                let tagInstances = await getTagInstancesByIds(params.tagIds);

                await newInstance.setTags(tagInstances);

                let data = await instanceFindById(newInstance.id);

                return resolve(data);

            });
        }
        /**
         * 更新数据
         * @param {Object} params 
         */
        instance.$put = (params) => {
            return new Promise(async (resolve, reject) => {

                // 清空密码
                delete params['password'];

                // 查找相同的 name 是否重名
                let sameNameInstance = await instance.findOne({
                    where: {
                        name: params.name
                    }
                });

                if (sameNameInstance && sameNameInstance.id != params.id) {
                    return reject('该商家名称已存在');
                }

                let oldInstance = await instance.findById(params.id);

                await oldInstance.update(params);

                let tagInstances = await getTagInstancesByIds(params.tagIds);

                await oldInstance.setTags(tagInstances);

                return resolve('已更新');

            });
        }

        /**
         * 通过 id 找到具体数据
         * @param {Number|String} id 
         */
        instance.$findById = (id) => {
            return new Promise(async (resolve, reject) => {
                let data = await instanceFindById(id);
                return resolve(data);
            });
        }

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
                        attributes: {
                            exclude: ['password']
                        },
                        include: [{
                            as: 'tags',
                            model: models.merchantTag,
                            through: {
                                attributes: [],
                            },
                        }],
                    })
                    .then((data) => {

                        delete params.pageNo;

                        let __data = getPageDate(data, pageNo, pageSize);

                        resolve(__data);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }

    }

    return instance;

}