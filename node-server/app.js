const Koa = require('koa');
const app = new Koa();

app.use(async ctx=>{
    console.log('url',ctx.request.url)
    ctx.body = 'hello world'
})

app.listen(3000)