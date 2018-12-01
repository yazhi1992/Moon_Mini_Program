// miniprogram/pages/share/share.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    peerName: "",
    peerImgUrl: "",
    peerId: "",
    alreadyWant: false,
    btnText: "接受邀请",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.id)
    this.setData({
      peerId: options.id
    })
    app.apiStart();
    this.getSelfInfo()
      .then(res => {
        return this.getFromUserInfo(options.id)
      })
      .then(res => {
        app.apiEnd();
        console.log("ok")
      })
      .catch(res => {
        app.apiError();
        console.log("err")
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

  
})