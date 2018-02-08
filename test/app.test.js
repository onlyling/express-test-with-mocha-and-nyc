const app = require('../app/app');
const request = require('supertest')(app);
const assert = require('power-assert');

describe('# test app.js', function () {
    it('GET /api2/ 404 test', function (done) {
        request
            .get('/api2/')
            .expect(404, done)
    });
    it('GET /api/500 test', function (done) {
        request
            .get('/api/500')
            .expect(200, done)
    });
});