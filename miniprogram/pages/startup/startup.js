// miniprogram/pages/startup/startup.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      // 查看是否授权
      wx.getSetting({
          lang:'zh_CN',
          success: function(res){
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                  wx.getUserInfo({
                      success: function(res) {
                          console.log(res.userInfo)
                          that.uploadUserInfo(res.userInfo);
                      }
                  })
              } else {
                  console.log("没有权限");
                  wx.showModal({
                      content: '请点击授权按钮，允许小程序获取您的昵称和头像~',
                      confirmText: "知道了",
                      showCancel: false,
                      success: function (res) {
                          if (res.confirm) {
                              console.log('用户点击确定')
                          }
                      }
                  });
              }
          }
      })

      // wx.cloud.callFunction({
      //     // 云函数名称
      //     name: 'getUserInfo',
      //     // 传给云函数的参数
      //     data: {
      //         userId: 'osvbh5BBZstiXMArAYOY7_d7b9-8',
      //     },
      //     success: function(res) {
      //         console.log(res);
      //         app.apiEnd();
      //     },
      //     fail: res => {
      //         console.log(res);
      //         api.apiError();
      //     }
      // })
  },

    clickShare: function() {
        // wx.showShareMenu()
    },

    bindGetUserInfo: function(e) {
        console.log(e.detail.userInfo)
        this.uploadUserInfo(e.detail.userInfo)
    },

    uploadUserInfo: function(info) {
        var that = this;
        // app.apiStart();
        console.log(info)
        wx.cloud.callFunction({
            // 云函数名称
            name: 'uploadUserInfo',
            // 传给云函数的参数
            data: {
                name: info.nickName,
                imgUrl: info.avatarUrl,
                gender: info.gender,
            },
            success: function(res) {
                app.apiEnd();
            },
            fail: res => {
                console.log(res);
                api.apiError();
            }
        })

    },

  /**
   * 生命周期函数--监听页面初次渲染完成
   *
   *
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
        title: 'test share',
        path: "pages/startup/startup?id=myidhahaha"
    }
  }
})



// 绑定逻辑
//
// 分享 -》 带 A Id
//
// users
// want  id
// inlove  true/false
//
// B 打开，根据携带的id ，getUserInfo 显示 A 请求绑定
// B 同意 --》 B want 设为 A ID -> 发送模板消息通知 A
//
// getWhoWantMe
// A 查询 users 表 中 want = 自己的，返回该用户的头像、名字
//
// 同意
// A want 添加  B，  A、B 的inlove 都为true  发送模板消息通知 B
//
// 拒绝
// B 的 want 移除 A