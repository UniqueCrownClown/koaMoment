const jwt = require('jsonwebtoken');
const User = require('../db').users
const {
    TOKEN_ENCODE_STR,
    URL_YES_PASS
} = require('./config');


module.exports = {
    // 生成登录 token
    create_token(str) {
        return jwt.sign({
            str
        }, TOKEN_ENCODE_STR, {
            expiresIn: '1h'
        });
    },
    /*  
      验证登录 token 是否正确  => 写成中间件
      get 请求与设置的请求不拦截验证，其余均需登录
    */
    async check_token(ctx, next) {
        let url = ctx.url;
        if (ctx.method != 'GET' && !URL_YES_PASS.includes(url)) {
            let token = ctx.get("Authorization");
            if (token == '') {
                // 直接抛出错误
                ctx.response.status = 401;
                ctx.response.body = "还没有登录，快去登录吧!";
                return;
            }
            try {
                //去掉Bearer前缀
                token = token.substring(7);
                // 验证token是否过期
                let {
                    str = ""
                } = await jwt.verify(token, TOKEN_ENCODE_STR);

                // 验证token与账号是否匹配
                let res = await User.find({
                    username: str,
                    token
                });
                if (res.length == 0) {
                    ctx.response.status = 401;
                    ctx.response.body = "登录过期，请重新登录!";
                    return;
                }
            } catch (e) {
                ctx.response.status = 500;
                ctx.response.body = "服务器异常请稍后再试!";
                return;
            }
        }
        await next();
    },
}