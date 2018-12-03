// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  try {
    var userId = event.userInfo.openId
    var tableName = ""
    var contentItemId = ""
    return await db.collection('loveHistory').doc(event.itemId).get()
      .then((res) => {
        if (res.data._openid == event.userInfo.openId || !res.data._openid) {
          //只能删除自己发的或系统发的
          return res.data
        } else {
          return new Promise(() => {});
        }
      })
      .then((res) => {
        //删除content信息
        contentItemId = res.contentId
        if (res.contentType == 0) {
          tableName = "singleText";
          return db.collection(tableName).doc(res.contentId)
            .get()
            .then(res => {
              console.log("获取到该条 singleText")
              console.log(res)
              if (res.data.imgId) {
                //有图片，查询图片是否是该用户当前的主页图片
                var thisImg = res.data.imgId
                return db.collection('users').doc(userId)
                  .get()
                  .then(res => {
                    console.log("获取 user 信息")
                    console.log(res)
                    if (thisImg == res.data.homeImg) {
                      //使用中，不删除图片
                      console.log("使用中，不删除图片")
                      return tableName
                    } else {
                      console.log("图片未使用，可删除")
                      const fileIDs = [thisImg]
                      console.log(thisImg)
                      console.log(fileIDs)
                      return cloud.deleteFile({
                          fileList: fileIDs,
                        })
                        .then(res => {
                          console.log("已删除图片,开始删除 singleText 表 item")
                          return tableName
                        })
                        .catch(err => {
                          console.log(err)
                          return tableName
                        })
                    }
                  })
              } else {
                return tableName;;
              }
            })
        } else if (res.contentType == 1) {
          tableName = "memorialDay";
          return tableName;
        }
      })
      .then(res => {
        console.log("table " + tableName + " itemid " + contentItemId)
        console.log("开始删除 content item")
        return db.collection(tableName).doc(contentItemId).remove();
      })
      .then((res) => {
        console.log("开始删除 loveHistory 表 item")
        return db.collection('loveHistory').doc(event.itemId).remove();
      })
  } catch (e) {
    console.error(e)
  }
}