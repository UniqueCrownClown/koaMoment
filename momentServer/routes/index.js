const router = require('koa-router')()
const controller = require('../controller')


router.post("/api/user", controller.user.register) //　用户注册
  .post("/api/user/login", controller.user.login) // 用户登录
  .get("/api/user/moment", controller.moment.getMoment) //获取所有用户的moment
  .get("/api/user/moment:username", controller.moment.getMoment) //获取指定username的moment
  .post("/api/user/addmoment", controller.moment.addMoment) //记录moment
  .delete("/api/user/moment:id") //删除指定id的moment
  .post("/api/user/admiremoment", controller.moment.setAdmire) //点赞某条moment
  .post("/api/user/comment/addcomment",controller.comment.addComment) //评论某条moment
  .post("/api/user/comment/commentone",controller.comment.commentOne) //基于某条comment回复

  .post("/api/user/postImage",controller.user.postImage)

module.exports = router