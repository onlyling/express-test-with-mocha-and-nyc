const AutoRoute = require('../lib/auto-route');

module.exports = (app) => {

    const route = new AutoRoute({
        app,
        filePath: __dirname,
        alias: {
            '/home': '/'
        }
    });

    console.log(route.routers);

}