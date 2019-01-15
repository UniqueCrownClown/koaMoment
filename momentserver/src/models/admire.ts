import { dbcontroller } from "../db";
const log = require("log4js").getLogger("admire");

const setAdmire = async (ctx: any) => {
  let params = ctx.request.body;
  log.info("setAdmire参数:" + params);

  var username = params.username;
  var momentid = params.momentid;
  try {
    var docs = await dbcontroller.admires.findOne({
      momentid: momentid
    });
    console.log(docs);
    if (docs != null) {
      dbcontroller.admires.update(
        {
          momentid: momentid
        },
        {
          $addToSet: {
            admire: username
          }
        }
      );
      ctx.body = {
        code: 200,
        msg: "点赞成功!"
      };
    } else {
      dbcontroller.admires.insert({
        momentid: momentid,
        admire: [username]
      });
    }
  } catch (e) {
    log.error(e);
    ctx.body = {
      code: 500,
      msg: "服务器异常请稍后再试!"
    };
  }
};

const removeAdmire = async (ctx: any) => {
  let params = ctx.request.body;
  log.info("removeAdmire参数:" + params);

  var username = params.username;
  var momentid = params.momentid;
  try {
    var docs = await dbcontroller.admires.findOne({
      momentid: momentid
    });
    console.log(docs);
    if (docs != null) {
      dbcontroller.admires.update(
        {
          momentid: momentid
        },
        {
          $pull: {
            admire: username
          }
        }
      );
      ctx.body = {
        code: 200,
        msg: "取消点赞成功!"
      };
    }
  } catch (e) {
    log.error(e);
    ctx.body = {
      code: 500,
      msg: "服务器异常请稍后再试!"
    };
  }
};

const getAdmire = async (ctx: any, next: any) => {
  let momentid = ctx.query.momentid;
  if (momentid != undefined) {
    const docs = await dbcontroller.admires.find({
      momentid: momentid
    });
    ctx.body = {
      code: 200,
      msg: "查询成功!",
      data: docs
    };
  }
  await next();
};
const admire = {
  setAdmire: setAdmire,
  removeAdmire: removeAdmire,
  getAdmire: getAdmire
};

export default admire;
