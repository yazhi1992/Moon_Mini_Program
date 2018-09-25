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
            // data 字段表示需新增的 JSON 数据
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
      });
  } catch (e) {
    console.error(e)
  }
}