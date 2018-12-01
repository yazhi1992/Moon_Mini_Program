const app = getApp();
var util = require('../../utils/utils.js')
var dbUtils = require('../../utils/dbUtils.js')
var cloud = require('../../cloud/cloud.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ''
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
              console.log("获取信息 wx.getUserInfo 成功");
              console.log(res)
              app.globalData.auth = true;
              app.apiStart();
              //获取信息后上报云
              that.uploadUserInfo(res.userInfo)
                .then(res => {
                  console.log(res.inLove)
                  console.log(Boolean(res.bindCode))
                  if (options.id) {
                    //转发页进入，调整邀请页
                    wx.navigateTo({
                      url: '../../pages/invite/invite?id=' + options.id,
                    })
                  }
                  if (!Boolean(options.id) && !res.inLove && Boolean(res.bindCode)) {
                    console.log("查询绑定状态")
                    //查询绑定状态
                    return cloud.getBindCode(res.bindCode)
                      .then(res => {
                        //检测是否有人请求绑定
                        console.log("getBindCode")
                        console.log(res)
                        if (res.data.length > 0) {
                          if (res.data[0].status == 1 && res.data[0].creater == dbUtils.getOpenId()) {
                            console.log("有人要请我")
                          } else {
                            console.log("没有邀请")
                          }
                        }
                      })
                      .catch(err => {
                        console.log(err)
                      })
                  } else {
                    console.log("no code")
                    return res
                  }
                })
                .then(res => {
                  app.apiEnd();
                })
                .catch(err => {
                  app.apiError();
                })
            }
          })
          app.globalData.auth = true;
        } else {
          console.log("没有权限");
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
    return new Promise((resolve, reject) => {
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
          console.log("上报云成功")
          console.log(res)
          app.globalData.userInfo = res.result;
          that.setData({
            imgUrl: res.result.homeImg
          })
          dbUtils.saveOpenId(res.result._openid)
          resolve(res.result)
        },
        fail: res => {
          console.log(res);
          reject(res)
        }
      })
    })
  },

  clickMc: function() {
    wx.navigateTo({
      url: '../../pages/mc/mc'
    })
  },

  clickMemory: function() {
    this.showToast()
  },

  clickHope: function() {
    this.showToast()
  },

  showToast: function() {
    var msg = '拼命开发中...\r\n敬请期待'
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 1500
    })
  },


  clickImg: function() {
    var that = this
    console.log('test')
    wx.chooseImage({
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0];
        var uploadFileName = util.randomImgName(tempFilePath)
        app.apiStart()
        wx.cloud.uploadFile({
          cloudPath: uploadFileName, // 上传至云端的路径
          filePath: tempFilePath, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res)
            //上报后台
            that.uploadHomeImg(res.fileID)
          },
          fail: res => {
            console.log(res);
            app.apiError();
          }
        })
      },
    })
  },

  uploadHomeImg: function(imgId) {
    var that = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'updateHomeImg',
      // 传给云函数的参数
      data: {
        homeImg: imgId,
      },
      success: function(res) {
        //显示在本机上
        that.setData({
          imgUrl: imgId
        })
        app.apiEnd();
      },
      fail: res => {
        console.log(res);
        app.apiError();
      }
    })
  }
})
