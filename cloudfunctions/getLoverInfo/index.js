// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('singleText')
      // .get()
    .where({
      _openid: _.in(['osvbh5BBZstiXMArAYOY7_d7b9-8','test']) // 填入当前用户 openid
    }).get()
  } catch (e) {
    console.error(e)
  }
  // return db.collection('singleText').where({
  //   _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8'
  // }).get({
  //   success: function (res) {
  //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
  //     console.log(res)
  //   }
  // })
  // return db.collection('singleText').get();
}