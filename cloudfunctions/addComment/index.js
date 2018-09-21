// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('loveHistory').doc(event.itemId).update({
        data: {
          comments: _.push({
            _openid: event.userInfo.openId,
            peerId: event.replyId,
            comment: event.comment,
            createAt: db.serverDate(),
          })
        }
      })
      .then((res) => {
        console.log('complete');
        return db.collection('loveHistory').doc(event.itemId).get()
      })
      .then((res) => {
        console.log(res);
        return res.data.comments[res.data.comments.length - 1]
      })
  } catch (e) {
    console.error(e)
  }
}