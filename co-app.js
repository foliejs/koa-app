const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = require('koa-router')()
const nestRouter = new Router()


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
// app.use(function *(next) {
//     // (3) 进入 response 中间件，没有捕获到下一个符合条件的中间件，传递到 upstream
//     yield next
//     this.body = 'Hello World'
//
// })

// koa 1.0x 嵌套路由
// nestRouter
//     .put('/', function *(next) {
//         console.log(this.method)
//         this.body = 'nest user data'
//         yield next()
//     })


// koa 1.0x 路由
router
    // .use('/form/:id/nest', nestRouter.routes(), nestRouter.allowedMethods())
    .get('/', function *(next) {
        this.body = 'Hello World'
    })
    .post('/users', function *(next) {
        this.status = 201
        this.body = 'add user'
    })
    .put('/users/:id', function *(next) {
        // total request parameters
        console.log(`request parameter`)
        console.log(this.params)
        console.log(`request method ${this.method}`)
        console.log(`request type ${this.type}`)
        console.log(`request header ${this.header}`)
        console.log(`request url ${this.url}`)
        console.log(`request querystring ${this.querystring}`)
        console.log(`request length ${this.length}`)
        console.log(`request host ${this.host}`)
        console.log(`request fresh ${this.fresh}`)
        console.log(`request stale ${this.stale}`)
        console.log(`request socket ${this.socket}`)
        console.log(`request protocol ${this.protocol}`)
        console.log(`request secure ${this.secure}`)
        console.log(`request ip ${this.ip}`)
        console.log(`request ips ${this.ips}`)
        console.log(`request subdomains ${this.subdomains}`)
        console.log(`request is ${this.is()}`)
        console.log(`request accepts() ${this.accepts()}`)
        console.log(`request acceptsEncodings ${this.acceptsEncodings()}`)
        console.log(`request acceptsCharsets ${this.acceptsCharsets()}`)
        console.log(`request acceptsLanguages ${this.acceptsLanguages()}`)
        // console.log(`request get ${this.get()}`)
        this.body = 'modify user'
    })
    .del('/users/:id', function *(next) {
        this.body = 'delete user'
    })
    // multiple middleware handle
    .get(
        '/multiple/:id',
        function *(next) {
            console.log(this.params)
            this.user = {username: 'jack son'}
            yield next
        },
        function *(next) {
            console.log(`Log User ${this.user}`)
            this.user = this.user.username
            yield next
        }
    )


app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log(`co-app has listening on port 3000`)
    })