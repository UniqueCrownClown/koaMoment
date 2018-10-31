// 中间层，用来连接数据库
const monk = require('monk');
const url = 'localhost:27017/moment';
const db = monk(url);
db.then(() => {
  console.log('Connected correctly to server')
})

const userCollection = db.get('users')
const momentCollection = db.get('moment')
const commentCollection = db.get('comment') //评论主表
const answerCollection = db.get('answer') //评论回复表

const dbcontroller = {
  users: userCollection,
  moments: momentCollection,
  comments: commentCollection,
  answers: answerCollection
}



module.exports = dbcontroller