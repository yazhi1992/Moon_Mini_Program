const AV = require('../../libs/av-weapp-min.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'http://lc-wl3lbfgv.cn-n1.lcfile.com/RgnxI7IGrZ6KFcxSzNOmzSG3XB6ZA6hDVoBDSTaI.jpg'
    // imgUrl: 'osvbh5BBZstiXMArAYOY7_d7b9-8'
  },

  clickImg: function() {
    var that = this
    console.log('test')
    wx.chooseImage({
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0];
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(function(file) {
          console.log(file.url())
          that.setData({
            imgUrl: file.url()
          })

        }).catch(console.error);
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      lang: 'zh_CN',
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res);
              app.globalData.auth = true;
              that.uploadUserInfo(res.userInfo);
            }
          })
          app.globalData.auth = true;
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'getUserInfo',
          }).then(res => {
            console.log(res);
            app.globalData.userInfo = res.result.data;
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log("没有权限");
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //更新用户昵称、头像、性别
  uploadUserInfo: function(info) {
    var that = this;
    app.apiStart();
    wx.cloud.callFunction({
      // 云函数名称
      name: 'uploadUserInfo',
      // 传给云函数的参数
      data: {
        type: that.data.type,
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

  clickMc: function() {
    wx.navigateTo({
      url: '../../pages/mc/mc'
    })
  },

  clickMemory: function() {
    
  },

  clickHope: function() {
    
  }
})