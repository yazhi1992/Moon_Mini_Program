// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    var userResult;
    //先查询是否有lover
    return await cloud.callFunction({
        name: 'getOpenidArray',
        data: {
          openId: event.userInfo.openId,
        }
      })
      .then((res) => {
        userResult = res.result;
        console.log(userResult);
        let actions = [];
        for (let i = 0; i < userResult.openIdArray.length; i++) {
          //更改自己和lover的homeImg
          console.log(userResult.openIdArray[i])
          actions.push(db.collection('users').where({
              _openid: userResult.openIdArray[i]
            })
            .update({
              data: {
                homeImg: event.homeImg
              }
            }))
        }
        return Promise.all(actions);
      })
      .then((res) => {
        return "ok";
      });
  } catch (e) {
    console.error(e)
  }
}