module.exports = (req, res, next) => {

    /**
     * 模板上的值
     */
    res.$renderData = {};

    /**
     * 给渲染模板添加值
     */
    res.$assign = (key, value) => {
        res.$renderData[key] = value;
    }

    /**
     * 渲染页面
     */
    res.$render = (tmp) => {
        res.render(tmp, res.$renderData);
    }

    next();

}