// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    try {
        return await db.collection('loveHistory').doc(event.itemId).get()
            .then((res) => {
                if(res.data._openid == event.userInfo.openId || !res.data._openid) {
                    //只能删除自己发的或系统发的
                    return res.data
                } else {
                    return new Promise(() => {});
                }
            })
            .then((res) => {
                //删除content信息
                var tableName = "";
                if(res.contentType == 0) {
                    tableName = "singleText";
                }else if(res.contentType == 1) {
                    tableName = "memorialDay";
                }
                db.collection(tableName).doc(res.contentId).remove();
                return res;
            })
            .then((res) => {
                return db.collection('loveHistory').doc(event.itemId).remove();
            })
    } catch(e) {
        console.error(e)
    }
}