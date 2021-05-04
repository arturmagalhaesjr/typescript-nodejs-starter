const app = require('../../src/app');
const request = require('supertest');
describe('Test the login', () => {
    let access_token = '';
    it('It should get the access token by passing the generic token', (done) => {
        return request(app)
            .post('/api/v0/login')
            .set('Authorization', 'Bearer token123')
            .expect(200)
            .end((err, response) => {
                expect(response.body.access_token).not.toBeNull();
                access_token = response.body.access_token;
                done();
            });
    });

    test('It should response OK', (done) => {
        return request(app)
            .get('/health-check')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test('It should get the 401 unauthorized by passing an invalid token', (done) => {
        return request(app)
            .post('/api/v0/login')
            .set('Authorization', 'Bearer INVALID_TOKEN')
            .then((response) => {
                expect(response.statusCode).toBe(401);
                done();
            });
    });
    test('It should get the 200 and data hello-world', (done) => {
        return request(app)
            .get('/api/v0/hello-world')
            .set('Authorization', 'Bearer ' + access_token)
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body.data).toBe('Hello World');
                done();
            });
    });
});
