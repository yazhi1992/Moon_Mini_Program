// miniprogram/pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHideLoadMore: false,
    // datas: this._generateColors()
    datas: [{
        userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        userName: "名字",
        imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        content: "test",
        comment: "DD回复辣辣：哈哈哈",
        time: "2018-12-12",
        typeIndex: 1
      },
      {
        userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        userName: "名字",
        imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        content: "test",
        comment: "DD回复辣辣：哈哈哈",
        time: "2018-12-12",
        typeIndex: 2
      },
      {
        userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        userName: "名字",
        imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        content: "test",
        comment: "DD回复辣辣：哈哈哈",
        time: "2018-12-12",
        typeIndex: 1
      },
      {
        userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        userName: "名字",
        imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        content: "test",
        comment: "DD回复辣辣：哈哈哈",
        time: "2018-12-12",
        typeIndex: 1
      },
      {
        userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        userName: "名字",
        imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
        content: "test",
        comment: "DD回复辣辣：哈哈哈",
        time: "2018-12-12",
        typeIndex: 1
      }
    ]
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
    setTimeout(() => {
      const ss = this._generateColors(3)
      this.setData({
        datas: ss
      })
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('加载更多')
    setTimeout(() => {
      const datas = this._generateColors(3)
      this.setData({
        datas: [...this.data.datas, ...datas]
      })
    }, 1000)
  },

  _generateColors: function (length) {
    return new Array(length).fill(null).map(() => this._randomColor());
  },

  _randomColor: function () {
    var data = {
      userImgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
      userName: "名字",
      imgUrl: "https://avatars1.githubusercontent.com/u/13739375?s=460&v=4",
      content: "test",
      comment: "DD回复辣辣：哈哈哈",
      time: "2018-12-12",
      typeIndex: 1
    }
    return data;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})