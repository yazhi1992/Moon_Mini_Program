//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    yearPercent:0,
    yearTitle:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //计算今天是一年中的第几天
    var date = new Date
    var year = date.getFullYear()
    var day = date.getDate()
    //一般公历年份数是4的倍数就是闰年，否则是平年；
    //但公历年份是整百数年数的必须是400的倍数才是闰年，不是400的倍数即为平年。
    var isLeap = (0 !== year % 100) && (0 === year % 4) || (year % 400 == 0)
    var fullYearDay = isLeap ? 366 : 365;
    var today = Math.ceil((date - new Date(year.toString())) / (24 * 60 * 60 * 1000));
    var test = parseInt(today / fullYearDay * 100)
    this.setData({
      yearPercent: test,
      yearTitle: year +"年进度条"
    })
    console.log('day', day, year, fullYearDay, today, test)
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  clikeHello: function() {
    this.setData({
      motto:'Hi',
      yearPercent:50
    })
  }
})
