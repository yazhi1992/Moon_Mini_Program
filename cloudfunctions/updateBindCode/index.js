// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('bindCodes')
    .where({
      value: parseInt(event.code)
    })
    .update({
      data: {
        status: event.status,
        requester: event.requester
      }
    })
}