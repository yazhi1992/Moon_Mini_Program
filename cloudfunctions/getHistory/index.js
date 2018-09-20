// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    return await db.collection('loveHistory')
        .where({
            _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
        }).get()
        .then((res) => {
            console.log(res.data._openid)
            db.collection('users').doc(event.userInfo.openId).get()
        })
}