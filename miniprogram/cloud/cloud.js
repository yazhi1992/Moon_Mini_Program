var dbUtils = require('../utils/dbUtils.js')
var util = require('../utils/utils.js')
const db = wx.cloud.database()

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
                    if(Boolean(res.data[0].requester)) {
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

module.exports = {
  getUserInfo: getUserInfo,
  updateWantId: updateWantId,
  getUserInfoById: getUserInfoById,
  newBindCode: newBindCode,
  getBindCode: getBindCode,
    requestBind:requestBind,
    cancelBind: cancelBind,
}
