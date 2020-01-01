const App = require('yeps');
const Router = require('yeps-router');

const error = require('yeps-error');
const response = require('yeps-response');
const bodyparser = require('yeps-bodyparser');
const server = require('yeps-server');

const storage = [];

const app = new App();

app.all([error({ isJSON: true }), response(), bodyparser()]);

const router = new Router();

router.get('/users').then(async (ctx) => {
    return ctx.response.resolve(storage);
});

router.post('/users').then(async (ctx) => {
    storage.push(ctx.request.body);

    return ctx.response.resolve({ message: 'Ok' });
});

router.get('/users/:id').then(async (ctx) => {
    const index = storage.findIndex((user) => {
        return user.id === parseInt(ctx.request.params.id, 10);
    });

    if (index !== -1) {
        return ctx.response.resolve(storage[index]);
    }

    const error = new Error();
    error.code = 404;

    return Promise.reject(error);
});

router.put('/users/:id').then(async (ctx) => {
    const index = storage.findIndex((user) => {
        return user.id === parseInt(ctx.request.params.id, 10);
    });

    if (index !== -1) {
        Object.assign(storage[index], ctx.request.body);
        return ctx.response.resolve({ message: 'Ok' });
    }

    const error = new Error();
    error.code = 404;

    return Promise.reject(error);
});

router.del('/users/:id').then(async (ctx) => {
    const index = storage.findIndex((user) => {
        return user.id === parseInt(ctx.request.params.id, 10);
    });

    if (index !== -1) {
        storage.splice(index, 1);
        return ctx.response.resolve({ message: 'Ok' });
    }

    const error = new Error();
    error.code = 404;

    return Promise.reject(error);
});


app.then(router.resolve());

module.exports = server.createHttpServer(app);