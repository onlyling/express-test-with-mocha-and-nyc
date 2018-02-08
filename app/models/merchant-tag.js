const {
    createPager,
    createDelete,
    createPost,
    createPut,
} = require('../lib/model-utils');

module.exports = (sequelize, DataTypes) => {

    let instance = sequelize.define('merchantTag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {},
        },
    }, {
        freezeTableName: true,
        tableName: 'merchant_tag',
    });

    instance.associate = (models) => {

        // 多对多
        instance.belongsToMany(models.merchant, {
            through: 'merchant_2_tag',
            as: 'merchants',
        });

        createPager(instance);
        createDelete(instance);
        // createPost(instance);
        // createPut(instance);
        instance.$post = (params) => {
            return new Promise((resolve, reject) => {
                instance
                    .findOne({
                        where: {
                            name: params.name
                        }
                    })
                    .then((data) => {
                        if (data) {
                            return Promise.reject('已经存在了');
                        }
                        resolve(instance.create(params));
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }

        instance.$put = (params) => {
            return new Promise((resolve, reject) => {
                instance
                    .findOne({
                        where: {
                            name: params.name
                        }
                    })
                    .then((data) => {
                        if (data && data.id != params.id) {
                            return Promise.reject('已经存在了');
                        }
                        return instance.findOne({
                            where: {
                                id: params.id
                            }
                        });
                    })
                    .then((data) => {
                        if (!data) {
                            return Promise.reject('不存在');
                        }
                        resolve(data.update(params));
                    })
                    .catch((err) => {
                        reject(err);
                    });

            });
        }

    }

    return instance;

}