// 如果用户inlove,返回自己和lover的信息

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
    var result = {
        openIdArray: [], //存储用户openId
        userMap: {}
    };
    result.openIdArray.push(event.openId);
    return await db.collection('users').doc(event.openId).get()
        .then((res) => {
            console.log(res);
            if(res.data.inLove) {
                result.openIdArray.push(res.data.want);
            }
            return result;
        })
        .then(() => {
            //获取所有用户信息
            let actions = [];
            for (let i = 0; i < result.openIdArray.length; i++) {
                actions.push(db.collection('users').doc(result.openIdArray[i]).get()
                    .then((res) => {
                        var id = result.openIdArray[i];
                        result.userMap[id] = res.data;
                        return result
                    }));
            }
            return Promise.all(actions);
        })
        .then((res) => {
            return result
        })
}