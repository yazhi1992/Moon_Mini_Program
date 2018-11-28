// pages/me/me.js
const app = getApp();
var sUtil = require('../../utils/storageUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myHeadUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
    myName: 'me',
    loverHeadUrl: 'https://avatars1.githubusercontent.com/u/13739375?s=460&v=4',
    loverName: 'lover',
    inLove: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: app.globalData.navHeight
    })

    console.log(sUtil.isInLove)
    // this.setData({
    //   inLove: sUtil.isInLove
    // })

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

  }
})