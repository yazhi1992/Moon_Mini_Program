// 根据 openid 获取用户信息
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  return await db.collection('users').doc(event.peerId)
    .get()
    .then(res => {
      console.log(res.data)
      return res.data
    })
}

//返回：
// {
//   result: {
//     id:xxx,
//     name:xxx,
//     ...
//   }
// }