const Koa = require('Koa')
const path = require('path')

const {
    LISTERN_PORT,
    STATIC_PATH
} = require('./util/config')
const {
    check_token
} = require('./util/token')


const app = new Koa()

//后绪可以用这个整个404
const onerror = require('koa-onerror')
onerror(app)

const log4js = require('log4js');
// log4js.configure('./config/log4js.json');
const log = log4js.getLogger("app");

//log工具
const logUtil = require('./util/logUtil');
// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        //开始进入到下一个中间件
        await next();
        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);
    } catch (error) {
        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});
//支持formData
const koaBody = require('koa-body')
app.use(koaBody({
    multipart: true,
    strict  : false,
    formidable: {
        maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认5M
    }
}))


//跨域
const cors = require('koa-cors')
app.use(cors({
    origin: function (ctx) {
        // if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        // }
        // return "http://localhost:8080"; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true, // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
})
);

// 添加token 验证中间件
app.use(check_token);

//设置静态资源的路径
const serve = require("koa-static")
app.use(serve(path.join(__dirname, STATIC_PATH), {
    extensions: ['png']
}));

const router = require('./routes')
app.use(router.routes())

app.listen(LISTERN_PORT);

log.info('app started at port ' + LISTERN_PORT + '...');