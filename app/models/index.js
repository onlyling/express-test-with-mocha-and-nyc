const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    getNodeEnv
} = require('../lib/utils');

const env = getNodeEnv();
const config = require(path.join(__dirname, '..', 'config', 'database.json'))[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config.option);

const db = {};

// 读取配置文件 创建模型
fs.readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file, i) => {
        let modal = sequelize.import(path.join(__dirname, file));
        db[modal.name] = modal;
    })

// 关联模型之间的关系
Object.keys(db).forEach((modelName) => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;