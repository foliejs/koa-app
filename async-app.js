const Koa = require('koa')
const router = require('koa-router')({
    prefix: '/prefix'
})
const app = new Koa()

// Koa 中间件以一种非常传统的方式级联起来，你可能会非常熟悉这种写法。
//
// 在以往的 Node 开发中，频繁使用回调不太便于展示复杂的代码逻辑，在 Koa 中，我们可以写出真正具有表现力的中间件。
// 与 Connect 实现中间件的方法相对比，Koa 的做法不是简单的将控制权依次移交给一个又一个的中间件直到程序结束，
// Koa 执行代码的方式有点像回形针，用户请求通过中间件，遇到 yield next 关键字时，会被传递到下一个符合请求的路由（downstream）
// ，在 yield next 捕获不到下一个中间件时，逆序返回继续执行代码（upstream）。
//
// 下边这个例子展现了使用这一特殊方法书写的 Hello World 范例：一开始，用户的请求通过
// x-response-time 中间件和 logging 中间件，这两个中间件记录了一些请求细节，然后「穿过」
// response 中间件一次，最终结束请求，返回 「Hello World」。
//
// 当程序运行到 yield next 时，代码流会暂停执行这个中间件的剩余代码，
// 转而切换到下一个被定义的中间件执行代码，这样切换控制权的方式，
// 被称为 downstream，当没有下一个中间件执行 downstream 的时候，代码将会逆序执行。

// async await
app.use(async(ctx, next) => {
    const start = new Date()
    console.log('1')
    await next()
    console.log('2')
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// basic middleware
app.use((ctx, next) => {
    const start = new Date()
    console.log('3')
    return next().then(() => {
        const ms = new Date() - start
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
})

router
    .get('/', async(ctx, next) => {

    })
    .put('/users', async(ctx, next) => {
        // total request parameters
        console.log(`request parameter`)
        console.log(ctx.params)
        console.log(`request method ${ctx.method}`)
        console.log(`request type ${ctx.type}`)
        console.log(`request header ${ctx.header}`)
        console.log(`request url ${ctx.url}`)
        console.log(`request querystring ${ctx.querystring}`)
        console.log(`request length ${ctx.length}`)
        console.log(`request host ${ctx.host}`)
        console.log(`request fresh ${ctx.fresh}`)
        console.log(`request stale ${ctx.stale}`)
        console.log(`request socket ${ctx.socket}`)
        console.log(`request protocol ${ctx.protocol}`)
        console.log(`request secure ${ctx.secure}`)
        console.log(`request ip ${ctx.ip}`)
        console.log(`request ips ${ctx.ips}`)
        console.log(`request subdomains ${ctx.subdomains}`)
        ctx.body = 'modify user'
        await next()
    })
    .post('/users/:id', async(ctx, next) => {
        await next()
    })
    .del('/users/:id', async(ctx, next) => {
        await next()
    })

    // multiple middleware
    .get(
        '/users/:id',
        async(ctx, next) => {
            ctx.body = 'multiple user data'
            await next()
        },
        async(ctx, next) => {
            ctx.body = 'multiple user data twice'
            console.log(ctx.body)
        }
    )

    // Router wildcard
    // .get(/^\/app(.*)(?:\/|$)/, async(ctx, next) => {
    //     ctx.body = 'wildcard regex body'
    //     await next()
    // })

// route.use(session(), authorize())

app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => {
        console.log(`async-app has listening on port 3000`)
    })