var dbUtils = require('../utils/dbUtils.js')
var util = require('../utils/utils.js')
const db = wx.cloud.database()
const _ = db.command

// {
//   data: {
//     name:xxx
//   }
// }
function getUserInfo() {
  var openid = dbUtils.getOpenId()
  console.log("getUserInfo openid: " + openid)
  return getUserInfoById(openid)
}

// {
//   data: {
//     name:xxx
//   }
// }
function getUserInfoById(id) {
  console.log("getUserInfoById openid: " + id)
  const db = wx.cloud.database()
  return db.collection('users').doc(id).get()
}

// 添加/删除 users 的 want id 属性
function updateWantId(wantId) {
  var openid = dbUtils.getOpenId()
  console.log("updateWantId openid: " + openid + " wantId " + wantId)
  return db.collection('users').doc(openid).update({
    data: {
      want: wantId
    }
  })
}

//生成 bindCode
function newBindCode() {
  var code = util.randomNum(1000, 9999)
  console.log("randomCode " + code)
  const db = wx.cloud.database()
  return db.collection('bindCodes').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        value: code,
        creater: dbUtils.getOpenId(),
        status: 0,
        createAt: db.serverDate()
      }
    })
    .then(res => {
      //添加到users表
      console.log("update users bindCode")
      db.collection('users').doc(dbUtils.getOpenId()).update({
        data: {
          bindCode: code
        }
      })
    })
    .then(res => {
      return code
    })
}

// {
//   data: { //Array[]
//       {},{}
//   }
// }
function getBindCode(code) {
  console.log("getBindCode code: " + code)
  return db.collection('bindCodes')
    .where({
      value: parseInt(code)
    })
    .get()
}

function requestBind(code) {
  var openid = dbUtils.getOpenId()
  console.log("requestBind code: " + code)
  //先查询邀请码信息，判断对方是否可邀请
  return getBindCode(code)
    .then(res => {
      return new Promise((resolve, reject) => {
        if (Boolean(res.data[0].requester)) {
          reject("正在等待用户处理已有的邀请")
        } else {
          //先修改目标邀请码的状态
          wx.cloud.callFunction({
              name: 'updateBindCode',
              data: {
                code: parseInt(code),
                status: 1,
                requester: openid
              }

            })
            .then(res => {
              resolve(code)
            })
        }
      })
    })
    .then(code => {
      //更新user的code
      console.log("更新user的code")
      return db.collection('users').doc(openid).update({
        data: {
          peerCode: parseInt(code)
        }
      })
    })
}

function cancelBind(code) {
  //先修改目标邀请码的状态
  console.log("code " + code)
  var openid = dbUtils.getOpenId()
  return wx.cloud.callFunction({
      name: 'updateBindCode',
      data: {
        code: parseInt(code),
        status: 0,
        requester: ""
      }
    })
    .then(res => {
      //更新user的code
      console.log("更新user的code")
      return db.collection('users').doc(openid).update({
        data: {
          peerCode: 0
        }
      })
    })
}

function rejectBind(myCode) {
  //将自己邀请码的request置空
  return wx.cloud.callFunction({
    name: 'updateBindCode',
    data: {
      code: parseInt(myCode),
      status: 0,
      requester: ""
    }
  })
}

function acceptBind() {

}

function addHistory(contentType, contentId) {
  console.log("addHistory")
  var openid = dbUtils.getOpenId()
  return db.collection('loveHistory').add({
    data: {
      contentType: parseInt(contentType),
      createAt: db.serverDate(),
      contentId: contentId
    }
  })
}

function addSingleText(imgwidth, imgheight, imgId, content) {
  return db.collection('singleText').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        imgheight: imgheight,
        imgwidth: imgwidth,
        imgId: imgId,
        content: content,
        createAt: db.serverDate(),
      }
    })
    .then(res => {
      console.log("新增 SingleText")
      console.log(res)
      //添加到 history 表
      return addHistory(0, res._id)
    })
}

function getOpenIdArray() {
  var usersData = {
    openIdArray: [], //存储用户openId
    userMap: {}
  };;
  var myId = dbUtils.getOpenId()
  usersData.openIdArray.push(myId)
  var loverId = dbUtils.getLoverId()
  if (loverId) {
    usersData.openIdArray.push(loverId)
  }
  console.log("getHistory usersData:")
  console.log(usersData)
  return new Promise((resolve, reject) => {
    //获取所有用户信息
    var index = 0;
    for (let i = 0; i < usersData.openIdArray.length; i++) {
      getUserInfoById(usersData.openIdArray[i])
        .then(res => {
          usersData.userMap[usersData.openIdArray[i]] = res.data;
          index++
          if (index == usersData.openIdArray.length) {
            resolve(usersData)
          }
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}


// [
//     {
//       name: xxx
//     },
//
//     {
//       name: xxx
//     }
// ]
function getHistory(fromIndex, size) {
  var userResult = {}
  var resultData = []
  return getOpenIdArray()
    .then(res => {
      userResult = res
      console.log("获取用户信息成功")
      console.log(userResult)
      return db.collection('loveHistory')
        .where({
          _openid: _.in(userResult.openIdArray)
        })
        .orderBy('createAt', 'desc')
        .skip(fromIndex)
        .limit(size)
        .get()
    })
    .then(res => {
      console.log("获取 loveHistory 数据成功")
      console.log(res)
      resultData = res.data;
      if (resultData.length > 0) {
        return new Promise((resolve, reject) => {
          for (let i = 0; i < resultData.length; i++) {
            console.log("补齐content内容 " + i)
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
            var index = 0
            db.collection(tableName).doc(contentItem.contentId).get()
              .then((res) => {
                index++
                console.log("获取content内容")
                console.log(res)
                resultData[i].content = res.data;
                if (index == resultData.length) {
                  resolve(resultData)
                }
              })
          }
        })
      } else {
        return resultData
      }
    })
    .then((res) => {
      console.log("getHistory 结束")
      console.log(res)
      return res;
    });
}

module.exports = {
  getUserInfo: getUserInfo,
  updateWantId: updateWantId,
  getUserInfoById: getUserInfoById,
  newBindCode: newBindCode,
  getBindCode: getBindCode,
  requestBind: requestBind,
  cancelBind: cancelBind,
  rejectBind: rejectBind,
  acceptBind: acceptBind,
  addSingleText: addSingleText,
  getHistory: getHistory,
}