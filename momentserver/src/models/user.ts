import * as path from "path";
import { dbcontroller } from "../db";
import tokenFn from "../util/token";
import { writeBase64, handleImageFile } from "../util/write";

const log = require("log4js").getLogger("user");

const login = async (ctx: any) => {
  const params = ctx.request.body;

  log.info("登录参数:" + params);

  const username = params.username;
  const password = params.password;
  try {
    const doc = await dbcontroller.users.findOne({
      username
    });
    if (doc == null || doc.password != password) {
      ctx.body = {
        code: 401,
        msg: "登录失败，用户名或者密码错误!"
      };
      return;
    }
    const token = tokenFn.create_token(username);
    // 登陆时更新一下token的值
    if (token != doc.token) {
      dbcontroller.users.update(
        {
          username
        },
        {
          $set: {
            token
          }
        }
      );
    }
    ctx.body = {
      code: 200,
      msg: "登录成功!",
      data: {
        id: doc._id,
        username: doc.username,
        token: doc.token,
        avatar: doc.avatar
      }
    };
  } catch (e) {
    console.log(e);
    log.error("登录异常" + e);
    ctx.body = {
      code: 500,
      msg: "登录失败，服务器异常!"
    };
  }
};

const register = async (ctx: any) => {
  const params = ctx.request.body;

  log.info("注册参数:" + params);

  const username = params.username;
  const pwd = params.password;
  const email = params.email;
  const avatar = params.avatar;
  try {
    // 判断 username 是否重复
    const res = await dbcontroller.users.find({
      username
    });
    if (res.length != 0) {
      ctx.body = {
        code: 409,
        msg: "注册失败,账号重复了，换个账号吧"
      };
      return;
    }
    let avatarPath;
    if (avatar != "") {
      const filePath = path.join("./public", username, "avatar.png");
      writeBase64(filePath, avatar);
      avatarPath = username;
    } else {
      avatarPath = "default";
    }

    const token = tokenFn.create_token(username);

    const success = await dbcontroller.users.insert({
      username,
      password: pwd,
      email,
      token,
      avatar: path.join(avatarPath, "avatar.png")
    });

    ctx.body = {
      code: 200,
      msg: "注册成功!",
      data: {
        username,
        token,
        avatar: path.join(avatarPath + "avatar.png")
      }
    };
  } catch (e) {
    log.error("注册异常" + e);
    ctx.body = {
      code: 500,
      msg: "注册失败，服务器异常!"
    };
  }
};

const postImage = async (ctx: any) => {
  const files = ctx.request.files.file; // 获取上传文件
  const filePath = "./public/upload/";
  const imageList = handleImageFile(filePath, files);
  log.info("postImage上传的图片路径数组为：" + imageList);
};

const user = {
  login,
  register,
  postImage
};

export default user;
