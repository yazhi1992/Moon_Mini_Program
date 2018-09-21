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
        .orderBy('createAt', 'desc')
        .get()
        .then((res) => {
          console.log(res);
          resultData = res.data;
          let actions = [];
          for (let i = 0; i < resultData.length; i++) {
              //查找user信息
            actions.push(db.collection('users').doc(resultData[i]._openid).get()
              .then((res) => {
                  resultData[i].user = res.data;
                return resultData[i]
              })
                .then((res) => {
                    //查找content信息
                    var tableName = "";
                    if(res.contentType == 0) {
                        tableName = "singleText";
                    } else if(res.contentType == 1) {
                        tableName = "memorialDay";
                    }
                    return db.collection(tableName).doc(res.contentId).get()
                })
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