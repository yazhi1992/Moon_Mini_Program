// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async(event, context) => {
  try {
    return await db.collection('users').where({
        _openid: event.userInfo.openId // 填入当前用户 openid
      }).count()
      .then((res) => {
        console.log(res)
        if (res.total == 0) {
          //新增
          console.log('新增')
          return db.collection('users').add({
            data: {
              _id: event.userInfo.openId,
              name: event.name,
              imgUrl: event.imgUrl,
              gender: event.gender,
              _openid: event.userInfo.openId,
            }
          })
        } else {
          //更新
          console.log('更新')
          return db.collection('users').where({
              _openid: event.userInfo.openId
            })
            .update({
              data: {
                name: event.name,
                imgUrl: event.imgUrl,
                gender: event.gender,
              },
            })
        }
      })
      .then(res => {
        console.log("getUserInfo " + event.userInfo.openId)
        return db.collection('users').doc(event.userInfo.openId).get()
      })
      .then(res => {
        console.log("getUserInfo suc")
        console.log(res)
        return res.data
      });
  } catch (e) {
    console.error(e)
  }
}

//返回：
// result: {
//   id: xxx,
//   name: xxx,
//   ...
// }