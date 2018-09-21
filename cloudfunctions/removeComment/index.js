// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
    try {
        var timestamp = Number(new Date());
        return await db.collection('loveHistory').doc(event.itemId).get()
            .then((res) => {
                console.log('complete');
                console.log(res);
                var newComments = res.data.comments;
                for (let i = 0; i < newComments.length; i++) {
                    if(newComments[i].timestamp == event.timestamp) {
                        newComments.splice(i,1);
                        break;
                    }
                }
                return newComments;
            })
            .then((res) => {
                console.log('new comments');
                console.log(res);
                return db.collection('loveHistory').doc(event.itemId).update({
                    data: {
                        comments: res
                    }
                });
            })
    } catch (e) {
        console.error(e)
    }
}