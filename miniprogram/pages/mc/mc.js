// pages/mc/mc.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseData: null,
    showAddBtn: false,
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

  dayClick: function(event) {
    this.setData({
      chooseData: event.detail,
      showAddBtn: true
    })
    console.log(event.detail);
  },

  clickAdd: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['姨妈来了', '姨妈走了'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.showConfirmDialog(1, that.data.chooseData)
          } else {
            that.showConfirmDialog(2, that.data.chooseData)
          }
        }
      }
    });
  },

  showConfirmDialog: function(action, chooseData) {
    wx.showModal({
      content: '选中日期：' + chooseData.year + '年' + chooseData.month + '月' + +chooseData.day + '日\r\n是否新增状态？',
      // content: 'asdfasdf',
      confirmText: "确认",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          app.apiStart()
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'addMc',
            // 传递给云函数的event参数
            data: {
              year: chooseData.year,
              month: chooseData.month,
              day: chooseData.day,
              action: action
            }
          }).then(res => {
            app.apiEnd()
          }).catch(err => {
            app.apiError()
          })
        }
      }
    });
  }
})