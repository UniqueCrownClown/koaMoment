import * as Koa from "koa";
import router from "./routes";

import tokenFn from "./util/token";
import { config } from "./util/config";

import * as path from "path";

const app = new Koa();

import * as onerror from "koa-onerror";
onerror(app);

//log工具
import logUtil from "./util/logUtil";
// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date().getTime();
  //响应间隔时间
  let ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date().getTime() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    ms = new Date().getTime() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});

//支持formData
import * as koaBody from "koa-body";
app.use(
  koaBody({
    multipart: true,
    strict: false,
    formidable: {
      maxFileSize: 500 * 1024 * 1024 // 设置上传文件大小最大限制，默认5M
    }
  })
);

//跨域
import * as cors from "koa-cors";
app.use(
  cors({
    origin: function(ctx: any) {
      // if (ctx.url === '/test') {
      return "*"; // 允许来自所有域名请求
      // }
      // return "http://localhost:8080"; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    expose: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true, // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    methods: ["GET", "POST", "DELETE"],
    headers: ["Content-Type", "Authorization", "Accept"]
  })
);

// 添加token 验证中间件
app.use(tokenFn.check_token);

//设置静态资源的路径
import * as serve from "koa-static";
import koaCors = require("koa-cors");
app.use(
  serve(path.join(__dirname, config.STATIC_PATH), {
    extensions: ["png"]
  })
);

app.use(router.routes());

import * as log4js from "log4js";
const log = log4js.getLogger("app");

app.listen(config.LISTERN_PORT);

log.info("app started at port " + config.LISTERN_PORT + "...");
