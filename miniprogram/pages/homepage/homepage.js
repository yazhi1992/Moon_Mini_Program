const app = getApp();
var util = require('../../utils/utils.js')
var dbUtils = require('../../utils/dbUtils.js')
var cloud = require('../../cloud/cloud.js')
const eventBus = require('../../utils/eventbus.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    useDefaultImg: true, //是否使用的是默认图片
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
                    return res
                  } else {
                    if (!res.inLove && Boolean(res.bindCode)) {
                      console.log("查询绑定状态")
                      //查询绑定状态
                      return cloud.getBindCode(res.bindCode)
                        .then(res => {
                          if (res.data.length > 0) {
                            if (res.data[0].requester && res.data[0].creater == dbUtils.getOpenId()) {
                              console.log("有人请求绑定我")
                              wx.showModal({
                                title: '提示',
                                content: '接收到绑定邀请，是否前往查看？',
                                success(res) {
                                  if (res.confirm) {
                                    wx.navigateTo({
                                      url: '../../pages/invite/invite',
                                    })
                                  }
                                }
                              })
                            } else {
                              console.log("没人请求绑定我")
                            }
                          }
                          return res
                        })
                    } else {
                      return res
                    }
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
        name: 'uploadUserInfo',
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
          //默认的图片
          var homeimg = "cloud://dev-70685f.ece4-dev-70685f/bg_home.jpg"
          var defaultImg = true
          if (res.result.homeImg) {
            homeimg = res.result.homeImg
            defaultImg = false
          }
          that.setData({
            imgUrl: homeimg,
            useDefaultImg: defaultImg
          })
          dbUtils.saveOpenId(res.result._openid)
          dbUtils.saveInLove(Boolean(res.result.inLove))
          if (res.result.inLove) {
            dbUtils.saveLoverId(res.result.want)
          }
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
    var oldImg = ""
    var newImg = ""
    wx.chooseImage({
      success: function(res) {
        app.apiStart()
        var tempFilePath = res.tempFilePaths[0];
        that.add2History(tempFilePath)
          .then(res => {
            var imgId = res
            console.log("修改我的homeImg 字段， imgId " + imgId)
            const db = wx.cloud.database()
            return db.collection('users').doc(dbUtils.getOpenId()).update({
                data: {
                  homeImg: imgId
                }
              })
              .then(res => {
                return imgId
              })
          })
          .then(res => {
            if (dbUtils.isInLove()) {
              var imgId = res
              console.log("准备修改 lover 的homeImg 字段， imgId " + imgId + " loverID " + dbUtils.getLoverId())
              return wx.cloud.callFunction({
                  name: 'updateUserInfoValue',
                  data: {
                    userId: dbUtils.getLoverId(),
                    homeImg: imgId,
                  }
                })
                .then(res => {
                  console.log("准备修改 lover 的homeImg 字段完成")
                  return imgId;
                })
            } else {
              console.log("还没有 lover")
              return res
            }
          })
          .then(res => {
            oldImg = that.data.imgUrl
            console.log("oldImg " + oldImg)
            newImg = res
            if (!that.data.useDefaultImg) {
              //使用自己的图片，则查询是否该图的singleText已删除
              console.log("使用自己的图片，查询图片相关的singleText是否存在")
              const db = wx.cloud.database()
              return db.collection('singleText')
                .where({
                  imgId: oldImg
                })
                .get()
                .then(res => {
                  if (res.data.length > 0) {
                    return newImg
                  } else {
                    //未找到相关的 singleText，则图片一起删除
                    wx.cloud.deleteFile({
                      fileList: [oldImg]
                    }).then(res => {
                      return newImg
                    }).catch(error => {
                      console.log(error)
                    })
                  }
                })
                .catch(err => {
                  console.log(err)
                })

            } else {
              return newImg
            }

          })
          .then(res => {
            //显示在本机上
            console.log('newImg ' + newImg)
            that.setData({
              imgUrl: newImg,
              useDefaultImg: false
            })
            console.log("结束")
            eventBus.emit('refreshHistory')
            app.apiEnd()
          })
          .catch(err => {
            app.apiError()
          })
      },
    })
  },

  add2History: function(imgPath) {
    return new Promise((resolve, reject) => {
      var uploadFileName = util.randomImgName(imgPath)
      wx.cloud.uploadFile({
        cloudPath: uploadFileName, // 上传至云端的路径
        filePath: imgPath, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res)
          var imgId = res.fileID
          wx.getImageInfo({
            src: imgPath,
            success(res) {
              console.log("getImgInfoSuc" + res.width + res.height)
              cloud.addSingleText(res.width, res.height, imgId, "")
                .then(res => {
                  console.log("添加到列表成功")
                  resolve(imgId)
                })
            }
          })
        },
        fail: res => {
          reject(res)
          console.log(res);
          app.apiError();
        }
      })
    })
  }

})