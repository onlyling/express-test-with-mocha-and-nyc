const app = require('../../../app/app');
const request = require('supertest')(app);
const assert = require('power-assert');

describe('# test router api merchant', function () {
    it('GET /api/merchant?id=1', function (done) {
        request
            .get('/api/merchant?id=1')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                assert.equal(res.body.success, true, '商家id为1有值');
                assert(Object.prototype.toString.call(res.body.data) === '[object Object]', '商家信息应该是一个对象');
                assert.equal(res.body.data.id, 1, '商家id为1');
                done();
            });
    });
    it('GET /api/merchant?id=99', function (done) {
        request
            .get('/api/merchant?id=99')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                assert.equal(res.body.success, false, '商家id为99没值');
                assert.equal(res.body.msg, '无数据', '不存在的商家，msg返回不正常');
                done();
            });
    });
    it('GET /api/merchant/all', function (done) {
        request
            .get('/api/merchant/all')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                assert(res.body.success === true);
                assert(Array.isArray(res.body.data), '商家列表应该还是一个列表');
                done();
            });
    });
    it('GET /api/merchant/list', function (done) {
        request
            .get('/api/merchant/list')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                assert(res.body.success === true);
                assert(Object.prototype.toString.call(res.body.data) === '[object Object]', '商家信息分页应该是一个对象');
                assert(Array.isArray(res.body.data.list), '商家列表应该还是一个列表');
                done();
            });
    });
});
