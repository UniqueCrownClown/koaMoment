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

const onerror = require('koa-onerror')
onerror(app)

const log4js = require('log4js');
log4js.configure('./config/log4js_2.json');
const log = log4js.getLogger("app");

app.use(log4js.connectLogger(log4js.getLogger("http"), {
    level: 'auto'
}));


//解析ctx的body
const bodyparser = require('koa-bodyparser')
app.use(bodyparser({
    formLimit: "5mb",
    jsonLimit: "5mb",
    textLimit: "5mb",
    enableTypes: ['json', 'form', 'text']
}))

//const koaBody = require('koa-body')
// app.use(koaBody({
//     multipart: true,
//     formidable: {
//         maxFileSize: 500*1024*1024    // 设置上传文件大小最大限制，默认5M
//     }
// }))

// 添加token 验证中间件
app.use(check_token);

//跨域
const cors = require('koa-cors')
app.use(cors());

//设置静态资源的路径
const serve = require("koa-static")
app.use(serve(path.join(__dirname, STATIC_PATH), {
    extensions: ['png']
}));

const router = require('./routes')
app.use(router.routes())

app.listen(LISTERN_PORT);

log.info('app started at port ' + LISTERN_PORT + '...');