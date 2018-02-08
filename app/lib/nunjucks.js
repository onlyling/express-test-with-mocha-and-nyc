const nunjucks = require('nunjucks');

module.exports = (app, views) => {
    let ev = nunjucks.configure(views, { // 设置模板文件的目录，为views
        autoescape: true,
        express: app,
        watch: false
    });
    app.set('view engine', 'html'); // 模板文件的后缀名字为html
}