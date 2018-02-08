const crypto = require('crypto');

/**
 * 获取 process.env.NODE_ENV
 */
const getNodeEnv = () => {
    return process.env.NODE_ENV || 'production';
}

/**
 * 是否是 开发、本地测试状态
 */
const isDev = (() => {
    return getNodeEnv() === 'dev' || getNodeEnv() === 'test';
})();

/**
 * 字符串转换才数组
 * @param {String} str 
 * @param {String} pla    分割标识
 */
const string2array = (str, pla = ',') => {
    return str ? str.split(pla) : [];
}

/**
 * 向左添加站位符
 * 著名 left-pad 库
 * @param {String|Number} str    需要格式化的数据 
 * @param {Number} len           总长度
 * @param {String|Number} ch     占位符
 * @return {String}              格式化后的字符串
 */
const leftpad = (str, len, ch) => {
    str = String(str);
    var i = -1;
    if (!ch && ch !== 0) ch = ' ';
    len = len - str.length;
    while (++i < len) {
        str = ch + str;
    }
    return str;
}

/**
 * 分页数据格式化
 * @param {*} datas
 * @param {*} pageNo
 * @param {*} pageSize
 */
const getPageDate = (datas, pageNo, pageSize) => {
    pageNo = +pageNo;
    return {
        list: datas.rows,
        pageSize,
        pageNo,
        totalItem: datas.count,
        totalPage: Math.ceil(datas.count / pageSize),
    };
};

/**
 * 加密
 * @param {*} str
 */
const doEncryptBySHA1 = str => {
    return crypto.createHash('sha1').update(str).digest('hex');
};

/**
 * 是否是密码格式
 * 大小写字母、数字、~!@#$%^_+=-,.
 * @param {*} str
 */
const isPassWord = str => {
    return (/^[a-zA-Z\d\~\!\@\#\$\%\^\_\+\=\-\,\.]+$/gi).test(str) && (str.length >= 6 && str.length <= 20);
};

module.exports = {
    getNodeEnv,
    isDev,
    string2array,
    getPageDate,
    doEncryptBySHA1,
    isPassWord,
}