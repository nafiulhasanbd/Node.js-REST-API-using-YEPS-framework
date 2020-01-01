const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('.');

chai.use(chaiHttp);

const { expect } = chai;

describe('REST API test', () => {
    after((done) => {
        server.close(done);
    });

    it('should test 404 error', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .get('/')
            .send()
            .catch((err) => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test get users', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .get('/users')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).is.a('array');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test create user', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        await chai.request(server)
            .post('/users')
            .send({ id: 1, name: 'user 1' })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.equal('Ok');
                isTestFinished1 = true;
            });

        await chai.request(server)
            .get('/users')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).is.a('array');
                expect(res.body[0].id).to.be.equal(1);
                expect(res.body[0].name).to.be.equal('user 1');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test user', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .get('/users/1')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.id).to.be.equal(1);
                expect(res.body.name).to.be.equal('user 1');
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test user with error', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .get('/users/10')
            .send()
            .catch((err) => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test update user', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        await chai.request(server)
            .put('/users/1')
            .send({ name: 'User 1' })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.equal('Ok');
                isTestFinished1 = true;
            });

        await chai.request(server)
            .get('/users/1')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.id).to.be.equal(1);
                expect(res.body.name).to.be.equal('User 1');
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test update user with error', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .put('/users/10')
            .send({ name: 'User 1' })
            .catch((err) => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });

    it('should test delete user', async () => {
        let isTestFinished1 = false;
        let isTestFinished2 = false;

        await chai.request(server)
            .delete('/users/1')
            .send()
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.be.equal('Ok');
                isTestFinished1 = true;
            });

        await chai.request(server)
            .get('/users/1')
            .send()
            .catch((err) => {
                expect(err).to.have.status(404);
                isTestFinished2 = true;
            });

        expect(isTestFinished1).is.true;
        expect(isTestFinished2).is.true;
    });

    it('should test delete user with error', async () => {
        let isTestFinished = false;

        await chai.request(server)
            .delete('/users/1')
            .send()
            .catch((err) => {
                expect(err).to.have.status(404);
                isTestFinished = true;
            });

        expect(isTestFinished).is.true;
    });
});