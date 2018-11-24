const md5 = require('md5')
const db = require('../db')
const {
    writeBase64,
    handleImageFile
} = require('../util/write')
const path = require('path')
const log = require('log4js').getLogger("moment")

const addMoment = async (ctx, next) => {

    const file = ctx.request.files.file; // 获取上传文件
    const message = ctx.request.body.message;
    const username = ctx.request.body.username;
    let momentId = md5(username + Date.parse(new Date())); //标记唯一的一条moment
    let filePath = path.join('./public', username, momentId);
    let temp = handleImageFile(filePath, file);
    //过滤处理一下public前缀
    let imageList =[];
    temp.forEach((element) => {
        imageList.push(element.substring(element.indexOf("public") +7));
    })
    let time = new Date().toLocaleString();
    try {
        const doc = await db.users.findOne({
            username: username
        });
        const success = await db.moments.insert({
            momentId: momentId,
            time: time,
            ownner: username,
            avatar: doc.avatar,
            message: message,
            imageList: imageList
        });
    } catch (e) {
        log.error(e);
        ctx.body = {
            code: 500,
            msg: 'moment发表失败,服务器异常!'
        }
    }
    ctx.body = {
        code: 200,
        msg: "moment发表成功!",
        data: {
            username,
            time,
            momentId
        }
    }
}

const deleteMoment = async (ctx, next) => {

    log.info("deleteMoment参数:" + ctx.params);
    let momentId = ctx.params.momentId;

    try {
        const success = await db.moments.remove({
            momentId: momentId
        });
        log.info("删除moment成功");
        ctx.body = {
            code: 200,
            msg: "删除成功!"
        }
    } catch (e) {
        log.error("删除moment失败" + e);
        ctx.body = {
            code: 500,
            msg: "删除失败!"
        }
    }
}

const getMoment = async (ctx, next) => {
    let username = ctx.query.username;
    if (username != undefined) {
        const docs = await db.moments.find({
            ownner: username
        });
        ctx.body = {
            code: 200,
            msg: "查询成功!",
            data: docs

        }
    } else {
        //查询所有的document出来
        const docs = await db.moments.find({});
        ctx.body = {
            code: 200,
            msg: "查询成功!",
            data: docs
        }
    }
}

const moment = {
    addMoment: addMoment,
    deleteMoment: deleteMoment,
    getMoment: getMoment
}

module.exports = moment