// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    var date = new Date()
    date.setFullYear(event.year, event.month-1, event.day)
    return await db.collection('mcHistory').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        year: event.year,
        month: event.month,
        day: event.day,
        action: event.action, //1 来，2 走
        timestamp: Number(date),
        createAt: db.serverDate(),
        _openid: event.userInfo.openId
      }
    })
  } catch (e) {
    console.error(e)
  }
}