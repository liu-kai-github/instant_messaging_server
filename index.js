const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

const handler = require('./handler');

app.use(bodyParser());

router.post('/api', async (ctx, next) => {
    // 得到响应体
    ctx.body = await handler(ctx);
});

app.on('error', function (err) {
    if (process.env.NODE_ENV != 'test') {
        console.log('sent error %s to the cloud', err.message);
        console.log(err);
    }
});

app.use(router.routes());

app.listen(8080);


