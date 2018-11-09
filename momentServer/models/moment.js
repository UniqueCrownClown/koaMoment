const md5 = require('md5')
const db = require('../db')
const writeBase64 = require('../util/write')
const path = require('path')
const log = require('log4js').getLogger("moment")


const addMoment = async (ctx, next) => {

    let params = ctx.request.body;
    log.debug("addMoment参数:" + params);

    let username = params.username;
    let message = params.message;
    let imageData = params.imageData;
    let total = params.total;
    let current = params.current;
    let momentId = params.momentId;
    if (!momentId) {
        momentId = md5(username + Date.parse(new Date())); //标记唯一的一条moment
    }
    let filePath = path.join('./public', username, momentId, current + '.png');
    writeBase64(filePath, imageData);
    let itemPath = path.join(username, momentId, current + '.png');
    let time = new Date().toLocaleString();
    try {
        const doc = await db.users.findOne({
            username: username
        });
        if (current === "1") {
            const success = await db.moments.insert({
                momentId: momentId,
                time: time,
                ownner: username,
                avatar: doc.avatar,
                message: message,
                imageList: [itemPath]
            });
            log.debug("第一片插库成功");
        } else {
            db.moments.update({
                momentId: momentId
            }, {
                $addToSet: {
                    imageList: itemPath
                },
            }, );
        }
        //最后一片(一直等不到最后一片怎么办，，等一段时间没收到需要清数据)
        if (current === total) {
            ctx.body = {
                code: 200,
                msg: "moment发表成功!",
                data: {
                    username,
                    time,
                    momentId
                }
            }
        } else {
            ctx.body = {
                code: 200,
                msg: "第" + current + "片上传成功!",
                data: {
                    momentId
                }
            }
        }
    } catch (e) {
        log.error(e);
        ctx.body = {
            code: 500,
            msg: 'moment发表失败,服务器异常!'
        }
    }
}

const deleteMoment = async (ctx, next) => {

    log.debug("deleteMoment参数:" + ctx.params);
    let momentId = ctx.params.momentId;

    try {
        const success = await db.moments.remove({
            momentId: momentId
        });
        log.debug("删除moment成功");
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