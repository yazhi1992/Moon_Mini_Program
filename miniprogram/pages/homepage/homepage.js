const AV = require('../../libs/av-weapp-min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: 'http://lc-wl3lbfgv.cn-n1.lcfile.com/RgnxI7IGrZ6KFcxSzNOmzSG3XB6ZA6hDVoBDSTaI.jpg'
  },

  clickImg: function () {
    var that = this
    console.log('test')
    wx.chooseImage({
      success: function (res) {
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
           
        }
          ).catch(console.error);
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
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

  },

  clickMc: function() {
    wx.navigateTo({
      url: '../../pages/mc/mc'
    })
  },

  clickMemory: function() {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getLoverInfo',
      success: function (res) {
        console.log(res.result.data) // 3
      },
      fail: console.error
    })
  },

  clickHope: function () {
    const db = wx.cloud.database()
    db.collection('singleText').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        content: "learn cloud database",
        due: new Date("2018-09-01")
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error
    })
  }
})

