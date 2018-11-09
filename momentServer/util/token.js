const jwt = require('jsonwebtoken');
const User = require('../db').users
const log = require('log4js').getLogger("token");
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
        log.debug(url);
        if (ctx.request.method != 'GET' && !URL_YES_PASS.includes(url)) {
            let token = ctx.get("Authorization");
            if (token == '') {
                // 抛出错误
                ctx.body = {
                    code: 401,
                    msg: '还没有登录，快去登录吧!',
                };
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
                    ctx.body = {
                        code: 401,
                        msg: '登录过期，请重新登录!',
                    };
                    return;
                }
            } catch (e) {
                log.error(e);
                ctx.body = {
                    code: 500,
                    msg: '服务器异常请稍后再试!',
                };
                return;
            }
        }
        await next();
    },
}