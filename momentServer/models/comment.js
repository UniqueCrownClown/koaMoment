const md5 = require('md5')
const db = require('../db')
const log = require('log4js').getLogger("comment")

//操作comment表
const addComment = async (ctx, next) => {

    let params = ctx.request.body;
    console.info(params);

    var username = params.username; //发表评论者，作为唯一id
    var message = params.message;
    var momentid = parames.momemtid; //评论哪一条moment
    var time = new Date().toLocaleDateString();
    var commentid = md5(momentid + Date.parse(new Date())); //标记唯一的一条comment
    try {
        const success = await db.comments.insert({
            id: commentid,
            time: time,
            ownner: momentid,
            message: message
        });
        console.log(success);
        ctx.body = {
            code: 200,
            msg: "评论发表成功!",
            data: {
                username,
                message,
                id
            }
        }
    } catch (e) {
        console.log(e);
        ctx.body = {
            code: 500,
            msg: '评论发表失败,服务器异常!'
        }
    }

}

//操作answer表
const commentOne = async (ctx, next) => {

    let params = ctx.request.body;
    console.info(params);

    var sourcename = params.sourcename; //发表评论者，作为唯一id
    var targetname = params.targetname;
    var message = params.message;
    var pid = params.commentid; //基于哪条commentid(父id)
    var time = new Date().toLocaleDateString();
    var id = md5(momentid + Date.parse(new Date())); //标记唯一的一条comment

    try {
        const success = await db.answer.insert({
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
        }

    } catch (e) {

    }

}

const comment = {
    addComment: addComment,
    commentOne: commentOne
}

module.exports = comment