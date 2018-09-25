// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  var resultData = [];
  var userResult;
  return await cloud.callFunction({
      name: 'getOpenidArray',
      data: {
        openId: event.userInfo.openId,
      }
    })
    .then((res) => {
      userResult = res.result;
      console.log(userResult);
      return db.collection('loveHistory')
        .where({
          _openid: _.in(userResult.openIdArray)
        })
        .orderBy('createAt', 'desc')
        .get()
    })
    .then((res) => {
      resultData = res.data;
      let actions = [];
      for (let i = 0; i < resultData.length; i++) {
        //补齐content内容中user信息
        var contentItem = resultData[i];
        var contentUserId = contentItem._openid;
        contentItem.user = userResult.userMap[contentUserId];
        //补齐评论中user消息
        if (contentItem.comments && contentItem.comments.length) {
          for (let j = 0; j < contentItem.comments.length; j++) {
            //评论者user信息
            var commentUserId = contentItem.comments[j]._openid;
            var user = userResult.userMap[commentUserId];
            contentItem.comments[j].user = user;
            //对方user信息
            var peerId = contentItem.comments[j].peerId;
            var replyUser = userResult.userMap[peerId];
            contentItem.comments[j].replyUser = replyUser;
          }
        }
        //查找content信息
        var tableName = "";
        if (contentItem.contentType == 0) {
          tableName = "singleText";
        } else if (contentItem.contentType == 1) {
          tableName = "memorialDay";
        }
        actions.push(db.collection(tableName).doc(contentItem.contentId).get()
          .then((res) => {
            return resultData[i].content = res.data;
          }))
      }
      return Promise.all(actions);
    })
    .then((res) => {
      return resultData;
    });


}