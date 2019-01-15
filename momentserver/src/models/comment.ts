import * as path from "path";
import * as md5 from "md5";
import { dbcontroller } from "../db";
import { handleImageFile } from "../util/write";

const log = require("log4js").getLogger("comment");
//操作comment表
const addComment = async (ctx: any, next: any) => {
  let params = ctx.request.body;
  console.info(params);
  let target = params.target;
  let source = params.source;
  let message = params.message;
  let momentid = params.momentid; //评论的唯一moment
  let belong = params.belong; //基于哪条commentid(父id)
  let time = new Date().toLocaleString();
  let commentid = md5(momentid + Date.parse(new Date().toDateString())); //标记唯一的一条comment
  try {
    const doc = await dbcontroller.comments.insert({
      id: commentid,
      belong: belong,
      time: time,
      momentid: momentid,
      message: message,
      source: source,
      target: target
    });
    console.log(doc);
    ctx.body = {
      code: 200,
      msg: "评论发表成功!",
      data: doc
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 500,
      msg: "评论发表失败,服务器异常!"
    };
  }
  await next();
};

//操作answer表
const commentOne = async (ctx: any) => {
  let params = ctx.request.body;
  console.info(params);

  var sourcename = params.sourcename; //发表评论者，作为唯一id
  var targetname = params.targetname;
  var message = params.message;
  var pid = params.commentid; //基于哪条commentid(父id)
  var time = new Date().toLocaleDateString();
  var id = md5(pid + Date.parse(new Date().toDateString())); //标记唯一的一条comment

  try {
    const success = await dbcontroller.answer.insert({
      sourcename: sourcename,
      targetname: targetname,
      id: id,
      pid: pid,
      message: message,
      time: time
    });
    console.log(success);
    ctx.body = {
      code: 200,
      msg: "回复评论成功!",
      data: {
        sourcename,
        targetname,
        message,
        id
      }
    };
  } catch (e) {}
};

//查询 comment表
const getComment = async (ctx: any, next: any) => {
  let momentid = ctx.query.momentid;
  if (momentid != undefined) {
    const docs = await dbcontroller.comments.find({
      momentid: momentid
    });
    ctx.body = {
      code: 200,
      msg: "查询成功!",
      data: docs
    };
  } else {
    //查询所有的document出来
    // const docs = await dbcontroller.comments.find({});
    ctx.body = {
      code: 200,
      msg: "该消息没有任何评论!"
    };
  }
  await next();
};

const comment = {
  addComment: addComment,
  commentOne: commentOne,
  getComment: getComment
};

export default comment;
