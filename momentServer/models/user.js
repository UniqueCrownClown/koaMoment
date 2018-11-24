const db = require('../db')
const log = require('log4js').getLogger("user");
const path = require('path')
const fs = require('fs');

const {
    create_token
} = require('../util/token');

const {
    writeBase64,
    handleImageFile
} = require('../util/write')

const login = async (ctx, next) => {
    let params = ctx.request.body;

    log.info("登录参数:" + params);

    var username = params.username;
    var password = params.password;
    try {
        let doc = await db.users.findOne({
            username: username,
        });
        if (doc == null || doc.password != password) {
            ctx.body = {
                code: 401,
                msg: '登录失败，用户名或者密码错误!',
            };
            return;
        }
        let token = create_token(username);
        //登陆时更新一下token的值
        if (token != doc.token) {
            db.users.update({
                username: username,
            }, {
                $set: {
                    token: token,
                },
            }, );
        }
        ctx.body = {
            code: 200,
            msg: '登录成功!',
            data: {
                id: doc._id,
                username: doc.username,
                token: doc.token,
                avatar: doc.avatar
            },
        };
    } catch (e) {
        console.log(e);
        log.error("登录异常" + e);
        ctx.body = {
            code: 500,
            msg: '登录失败，服务器异常!',
        };
    }
};

const register = async (ctx, next) => {
    let params = ctx.request.body;

    log.info("注册参数:" + params);

    var username = params.username;
    var pwd = params.password;
    var email = params.email;
    var avatar = params.avatar;
    try {
        // 判断 username 是否重复
        let res = await db.users.find({
            username: username,
        });
        if (res.length != 0) {
            ctx.body = {
                code: 409,
                msg: '注册失败,账号重复了，换个账号吧',
            };
            return;
        }
        let avatarPath;
        if (avatar != "") {
            let filePath = path.join('./public', username, 'avatar.png');
            writeBase64(filePath, avatar)
            avatarPath = username;
        } else {
            avatarPath = "default";
        }


        let token = create_token(username);

        const success = await db.users.insert({
            username: username,
            password: pwd,
            email: email,
            token: token,
            avatar: path.join(avatarPath, 'avatar.png')
        });

        ctx.body = {
            code: 200,
            msg: '注册成功!',
            data: {
                username: username,
                token: token,
                avatar: path.join(avatarPath + 'avatar.png')
            }
        };
    } catch (e) {
        log.error("注册异常" + e);
        ctx.body = {
            code: 500,
            msg: '注册失败，服务器异常!'
        };
    }
};

const postImage = async (ctx, next) => {
    const files = ctx.request.files.file; // 获取上传文件
    let filePath = './public/upload/';
    let imageList = handleImageFile(filePath,files);
    log.info("postImage上传的图片路径数组为："+ imageList);
};

const user = {
    login: login,
    register: register,
    postImage: postImage,
};

module.exports = user;