// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log('newdoc');
  var resultData = [];
    return await db.collection('loveHistory')
        .where({
            _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
        })
        .get()
        .then((res) => {
          console.log(res);
          resultData = res.data;
          let actions = [];
          for (let i = 0; i < resultData.length; i++) {
            console.log('for')
            actions.push(db.collection('users').doc(resultData[i]._openid).get()
              .then((res) => {
                console.log('ok')
                console.log(res)
                resultData[i].user = res.data;
              }))
          }
          return Promise.all(actions);
            // console.log(res.data._openid)
            // db.collection('users').doc(event.userInfo.openId).get()
        })
        .then((res) => {
          console.log('final')
          return resultData;
        });

  
}