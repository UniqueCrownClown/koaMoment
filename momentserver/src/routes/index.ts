import * as Router from "koa-router";

import user from "./../models/user";
import moment from "./../models/moment";
import comment from "./../models/comment";
import admire from "./../models/admire";

const router = new Router();

router
  .post("/api/user", user.register) // 　用户注册
  .post("/api/user/login", user.login) // 用户登录
  .get("/api/user/moment", moment.getMoment) // 获取所有用户的moment
  .get("/api/user/moment:username", moment.getMoment) // 获取指定username的moment
  .post("/api/user/addmoment", moment.addMoment) // 记录moment
  .delete("/api/user/moment:id") // 删除指定id的moment
  .get("/api/user/admire", admire.getAdmire)
  .post("/api/user/setadmire", admire.setAdmire) // 点赞
  .post("/api/user/deladmire", admire.removeAdmire) // 取消点赞
  .post("/api/user/addcomment", comment.addComment) // 评论某条moment
  .post("/api/user/comment/commentone", comment.commentOne) // 基于某条comment回复
  .get("/api/user/comment", comment.getComment) // 获取评论
  .post("/api/user/postImage", user.postImage); // 上传图片

export default router;
