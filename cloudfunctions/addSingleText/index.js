// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('singleText').add({
      data: {
        content: event.content,
        createAt: db.serverDate(),
          imgId: event.imgId,
        _openid: event.userInfo.openId,
      }
    })
    .then((res) => {
      return db.collection('singleText').doc(res._id).get()
    })
    .then((res) => {
      return cloud.callFunction({
        // 要调用的云函数名称
        name: 'addHistory',
        // 传递给云函数的参数
        data: {
          content: res.data,
          openId: res.data._openid,
          contentType: 0
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}