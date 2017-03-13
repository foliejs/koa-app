const Koa = require('koa')
const app = new Koa()


// koa 1.0x co+generate
// x-response-time
app.use(function *(next) {
    // (1) 进入路由
    let start = new Date
    yield next
    // (5) 再次进入 x-response-time 中间件，记录2次通过此中间件「穿越」的时间
    let ms = new Date - start
    this.set('X-Response-Time', ms + 'ms')
    // (6) 返回 this.body
})

// logger
app.use(function *(next) {
    // (2) 进入 logger 中间件
    let start = new Date
    yield next
    // (4) 再次进入 logger 中间件，记录2次通过此中间件「穿越」的时间
    let ms = new Date - start
    console.log('%s %s - %s', this.method, this.url, ms)
})

// response
app.use(function *() {
    // (3) 进入 response 中间件，没有捕获到下一个符合条件的中间件，传递到 upstream
    this.body = 'Hello World'
})

app.use(function *() {
    // this          上下文对象
    // this.request  request 对象
    // this.response response 对象

    // ctx 代理
    // ctx.path
    // ctx.method
    // ctx.length
    // ctx.type
})

app.listen(3000, () => {
    console.log(`co-app has listening on port 3000`)
})