const path = require('path');
const fs = require('fs');

class AutoRoute {
    constructor(option) {
        this.option = Object.assign({
            app: null, // Express 实例
            filePath: null, // 路由文件路径
            rootUrl: '/', // 根路由
            alias: {},
        }, option);

        if (!this.option.app) {
            console.log('没有Express实例');
            return;
        }

        if (!this.option.filePath) {
            console.log('没有路由文件路径');
            return;
        }

        this.routers = [];
        this.init();
    }

    init() {

        let {
            filePath,
            rootUrl
        } = this.option;

        this.createRoute(filePath, rootUrl);
    }

    createRoute(filePath, rootUrl) {
        let {
            app,
            alias
        } = this.option;

        fs.readdirSync(filePath)
            .forEach((file) => {
                let __thisFilePath = path.join(filePath, file);
                let __thisFile = fs.statSync(__thisFilePath);
                let __fileName = path.basename(file, '.js');

                if (__thisFile.isDirectory()) {
                    this.createRoute(__thisFilePath, path.join(rootUrl, __fileName));
                } else {

                    let __routeModule = require(__thisFilePath);

                    if (!this.isRouter(__routeModule)) {
                        return;
                    }

                    let __originalUrl = path.join(rootUrl, __fileName);
                    let __url = alias[__originalUrl] || __originalUrl;

                    app.use(__url, __routeModule);
                    this.routers.push(__url);
                }
            })
    }

    isRouter(router) {
        return typeof router.route === 'function';
    }

}

module.exports = AutoRoute;