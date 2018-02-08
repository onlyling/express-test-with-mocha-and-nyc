const api = require('./api');
const render = require('./render');

module.exports = function(app) {
    app.use(api);
    app.use(render);
};