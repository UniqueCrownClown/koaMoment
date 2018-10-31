module.exports = {
  //koa服务起的监听端口
  LISTERN_PORT: "3000",
  //静态服务根路径
  STATIC_PATH: "./public",
  // token 加密字符串
  TOKEN_ENCODE_STR: "moment",
  // 添加非get请求通过的连接
  URL_YES_PASS: ['/api/user/login', '/api/user', '/api/user/postImage', '/api/user/addmoment']
}