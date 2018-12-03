// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()
cloud.init()
exports.main = async (event, context) => {
    return await db.collection('users').where({
        _openid: event.userId
    })
        .update({
            data: {
                homeImg: event.homeImg ? event.homeImg : null,
                inLove: event.inLove? Boolean(event.inLove) : null,
                want: event.want ? want : null,
            },
        })
}

//参数：
// userId：用户的 openid
// homeImg： 首页图片
// inLove： 1 true
// want: lover openid
