// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('loveHistory').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        contentType: event.contentType,
        createAt: db.serverDate(),
        content: event.content,
        _openid: event.openId
      }
    })
  } catch (e) {
    console.error(e)
  }
}