// pages/me/me.js
const app = getApp();
var sUtil = require('../../utils/dbUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myHeadUrl: "",
    myName: '',
    loverHeadUrl: '',
    loverName: '',
    inLove: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      myHeadUrl: app.globalData.userInfo.imgUrl,
      myName: app.globalData.userInfo.name
    })

    console.log("--" +sUtil.isInLove())
    // this.setData({
    //   inLove: sUtil.isInLove
    // })

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

  clickProgress: function() {
    wx.navigateTo({
      url: '../../pages/time/time'
    })
  },

  clickAboutUs: function() {
    wx.navigateTo({
      url: '../../pages/aboutus/aboutus'
    })
  },

  clickInvite: function () {
    wx.navigateTo({
      url: '../../pages/invite/invite'
    })
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
