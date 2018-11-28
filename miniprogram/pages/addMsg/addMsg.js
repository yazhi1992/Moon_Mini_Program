// miniprogram/pages/addMsg/addMsg.js

var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewImg: "./add_img_icon.png",
    pickImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  // 选择图片
  pickImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          previewImg: res.tempFilePaths,
          pickImg: true
        })
      }
    })
  },

  bindFormSubmit: function(e) {
    var that = this;
    var content = e.detail.value.textarea;
    app.apiStart()
    if (that.data.pickImg) {
      //有图片先上传
      var uploadFileName = util.randomImgName(that.data.previewImg[0])
      console.log(uploadFileName)
      wx.cloud.uploadFile({
        cloudPath: uploadFileName, // 上传至云端的路径
        filePath: that.data.previewImg[0], // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res)
          var imgId = res.fileID
          wx.getImageInfo({
            src: that.data.previewImg[0],
            success(res) {
              console.log("getImgInfoSuc" + res.width + res.height)
              that.addMsg(imgId, res.width, res.height, content)
            }
          })
        },
        fail: res => {
          console.log(res);
          app.apiError();
        }
      })
    } else {
      that.addMsg(null, 0, 0, content)
    }
  },

  addMsg: function(imgId, imgwidth, imgheight, content) {
    console.log("addMsg" + imgwidth + imgheight)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addSingleText',
      // 传给云函数的参数
      data: {
        imgheight: imgheight,
        imgwidth: imgwidth,
        imgId: imgId,
        content: content,
      },
      success: function(res) {
        app.apiEnd();
      },
      fail: res => {
        console.log(res);
        api.apiError();
      }
    })
  }
})