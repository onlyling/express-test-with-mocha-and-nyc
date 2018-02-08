const express = require('express');
const expressSession = require('express-session');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

require('express-async-errors');

const Utils = require('./lib/utils');
const {
    isDev
} = Utils;
const Models = require('./models');
const {
    sequelize
} = Models;

const app = express();

if (!isDev) {
    log4js.configure({
        appenders: {
            console: {
                type: 'console',
            },
            logs: {
                type: 'dateFile',
                filename: './logs/logs.log',
                pattern: '-yyyy-MM-dd',
            },
        },
        categories: {
            default: {
                appenders: ['console', 'logs'],
                level: 'debug',
            },
        }
    });
    // 每个请求都记录在日志
    app.use(log4js.connectLogger(log4js.getLogger('http'), {
        level: log4js.levels.INFO
    }));
}

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(expressSession({
    saveUninitialized: true,
    secret: 'keyboard cat',
    store: new SequelizeStore({
        db: sequelize,
        expiration: 60 * 60 * 1000, // 一小时过期
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
}));

// 注入各种需要的
app.use((req, res, next) => {
    req.Models = Models;
    req.Logger = log4js;
    req.Utils = Utils;
    next();
});

// 模板
require('./lib/nunjucks')(app, path.join(__dirname, 'views'));

// 中间件
require('./middleware')(app);

// 路由
require('./routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = isDev ? err : {};

    if (req.originalUrl.indexOf('/api/') >= 0) {
        res.$apiError(err);
    } else {
        // render the error page
        res.status(err.status || 500);
        res.$assign('error', err);
        res.$assign('status', err.status || 500);
        res.$render('error');
    }
});

module.exports = app;