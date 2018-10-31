const db = require('../db')
const log = require('log4js').getLogger("user");

const {
    create_token
} = require('../util/token');

const writeBase64 = require('../util/write')

const login = async (ctx, next) => {
    let params = ctx.request.body;

    log.debug("登录参数:" + params);

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

    log.debug("注册参数:" + params);

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
            var filePath = './public/' + username + '/avatar.png';
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
            avatar: "/" + avatarPath + "/avatar.png"
        });

        ctx.body = {
            code: 200,
            msg: '注册成功!',
            data: {
                username: username,
                token: token,
                avatar: getIPAdress() + ":" + LISTERN_PORT + "/" + avatarPath + "/avatar.png"
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
    // console.log(ctx.request.files);
    // 上传单个文件
    const file = ctx.request.files.file; // 获取上传文件
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    //__dirname返回当前文件的路径
    let filePath = './public/upload/' + `${file.name}`;
    mkdirsSync('./public/upload');
    console.log(filePath);
    // 创建可写流`
    const upStream = fs.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    // 处理流事件 --> data, finish, and error
    reader.on('finish', function () {
        ctx.body = {
            code: 200,
            msg: '发送成功 ！',
        };
        log.debug('写入完成');
    });
    reader.on('error', function (err) {
        log.error(err.stack)
    });
};

const user = {
    login: login,
    register: register,
    postImage: postImage,
};

module.exports = user;