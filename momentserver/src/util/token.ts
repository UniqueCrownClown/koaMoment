import { config } from "./config";
import { dbcontroller } from "../db";
import * as jwt from "jsonwebtoken";

const log = require("log4js").getLogger("token");
const User = dbcontroller.users;
const tokenFn = {
  // 生成登录 token
  create_token(str: string) {
    return jwt.sign(
      {
        str
      },
      config.TOKEN_ENCODE_STR,
      {
        expiresIn: "1h"
      }
    );
  },
  /*
      验证登录 token 是否正确  => 写成中间件
      get 请求与设置的请求不拦截验证，其余均需登录
    */
  async check_token(ctx: any, next: any) {
    const url = ctx.url;
    log.info(url);
    if (ctx.request.method != "GET" && !config.URL_YES_PASS.includes(url)) {
      let token = ctx.get("Authorization");
      if (token == "") {
        // 抛出错误
        ctx.body = {
          code: 401,
          msg: "还没有登录，快去登录吧!"
        };
        return;
      }
      try {
        // 去掉Bearer前缀
        token = token.substring(7);
        // 验证token是否过期
        const str = await jwt.verify(token, config.TOKEN_ENCODE_STR);

        // 验证token与账号是否匹配
        const res = await User.find({
          username: str,
          token
        });
        if (res.length == 0) {
          ctx.body = {
            code: 401,
            msg: "登录过期，请重新登录!"
          };
          return;
        }
      } catch (e) {
        log.error(e);
        ctx.body = {
          code: 500,
          msg: "服务器异常请稍后再试!"
        };
        return;
      }
    }
    await next();
  }
};

export default tokenFn;
