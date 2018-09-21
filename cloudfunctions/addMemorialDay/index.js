// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    try {
        return await db.collection('memorialDay').add({
            data: {
                title: event.title,
                timestamp: event.timestamp, //格式：1537459200 单位秒
                createAt: db.serverDate(),
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
                        contentType: 1
                    }
                })
            })
    } catch (e) {
        console.error(e)
    }
}
