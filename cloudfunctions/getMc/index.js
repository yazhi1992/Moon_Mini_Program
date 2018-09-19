// 云函数入口文件
// 返回某年某月的 mc 记录 + 本月前一个记录 + 本月后一个记录
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    var result = new Array
    return await db.collection('mcHistory')
      .where({
        _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
        year: event.year,
        month: event.month
      })
      .orderBy('timestamp', 'asc')
      .get()
      .then((res) => {
        if (res.data.length) {
          result = result.concat(res.data)
          var firstTime = result[0].timestamp
          const _ = db.command
          //查询上一个
          return db.collection('mcHistory')
            .where({
              _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
              timestamp: _.lt(firstTime)
            })
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
        } else {
          //空数据，不继续往下执行
          return new Promise(() => {});
        }
      })
      .then((res) => {
        if (res.data.length) {
          //有数据则添加
          result.unshift(res.data[0])

        }
        var lastTime = result[result.length - 1].timestamp
        const _ = db.command
        //查询下一个
        return db.collection('mcHistory')
          .where({
            _openid: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
            timestamp: _.gt(lastTime)
          })
          .orderBy('timestamp', 'asc')
          .limit(1)
          .get()
      })
      .then((res) => {
        if (res.data.length) {
          //有数据则添加
          result.push(res.data[0])
        }
        return result
      })
  } catch (e) {
    console.error(e)
  }
}