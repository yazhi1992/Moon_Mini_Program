// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    try {
        return await db.collection('loveHistory').doc(event.itemId).get()
            .then((res) => {
                if(res.data._openid == event.userInfo.openId) {
                    //只能删除自己发的
                    return db.collection('loveHistory').doc(event.itemId).remove();
                } else {
                    return new Promise(() => {});
                }
            })
    } catch(e) {
        console.error(e)
    }
}