// miniprogram/pages/addMemorialDay/addMemorialDay.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
  },

  bindFormSubmit: function(e) {
    var title = e.detail.value.textarea;
      this.addMemorialDay(title)
  },

  addMemorialDay: function(title) {
      app.apiStart()
      var myData = this.data.date.replace(/-/g,'/');
      var timestamp = new Date(myData).getTime()/1000;
      console.log(timestamp)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'addMemorialDay',
      // 传给云函数的参数
      data: {
        title: title,
        timestamp: timestamp,
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

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var time = app.formatDateTimeToYYMMDD(Number(new Date()))
    console.log(time)
    this.setData({
      date: time,
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

  }
})