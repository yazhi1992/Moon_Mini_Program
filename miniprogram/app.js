//app.js
const AV = require('./libs/av-weapp-min.js');

// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'WL3lBfgV8sxfnMY6pncNKFYS-gzGzoHsz',
  appKey: 'SzsGqfiCT76Ige87Nz9zUtXs',
});

App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      }),

      // 获取手机系统信息
      wx.getSystemInfo({
        success: res => {
          //导航高度
          this.globalData.navHeight = res.statusBarHeight + 46;
        },
        fail(err) {
          console.log(err);
        }
      })
  },

  globalData: {
    userInfo: null,
    navHeight: "64"
  },

  randomNum: function (n, m) {
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
  },

  getSuffix: function(path) {
    let fileName = path.lastIndexOf(".");//取到文件名开始到最后一个点的长度
    let fileNameLength = path.length;//取到文件名长度
    let fileFormat = path.substring(fileName, fileNameLength);//截
    return fileFormat;
  },

  apiStart: function() {
    wx.showLoading({
      title: '努力加载中',
      icon: 'loading'
    })
  },

  apiEnd: function() {
    wx.hideLoading()
    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1500
    });
  },

  apiError: function () {
    wx.showToast({
      title: '数据同步失败\r\n请重试',
      icon: 'none',
      duration: 2000
    });
  }
  
})