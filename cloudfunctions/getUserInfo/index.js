// 云函数入口函数
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  return await db.collection('users').where({
    _openid: event.userId,
  }).get()
}