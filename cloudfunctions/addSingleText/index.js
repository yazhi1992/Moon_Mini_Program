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
      return cloud.callFunction({
        // 要调用的云函数名称
        name: 'addHistory',
        // 传递给云函数的参数
        data: {
          contentId: res._id,
          openId: event.userInfo.openId,
          contentType: 0
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}


// .then((res) => {
//     return db.collection('loveHistory').add({
//         // data 字段表示需新增的 JSON 数据
//         data: {
//             contentType: 0,
//             createAt: db.serverDate(),
//             content: res.data,
//             _openid: event.userInfo.openId,
//         }
//     })
// })