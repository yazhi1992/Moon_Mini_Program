// miniprogram/pages/history/history.js

var util = require('../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeigt: 0,
    pullUpAllow: true,
    pullLowAllow: true,
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

  },

  upper: function () {
    var that = this
    // var timestamp = Date.parse(new Date()) / 1000;
    // var lastTime = this.data.lastLoadTime
    // if (timestamp - lastTime < 0) {
    //     console.log('太快了')
    // } else {
    //     that.setData({ lastLoadTime: timestamp })
    if (that.data.pullUpAllow) {
      console.log('刷新啦')
      that.setData({
        pullUpAllow: false,
      })
      // console.log(that.data.classidnow)

      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000,
      });

      setTimeout(() => {
        var jobs = this._generateColors(3)
        this.setData({
          datas: jobs,
          pullUpAllow: true,
        })

        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        setInterval(() => {
          that.setData({
            pullUpAllow: true
          })
        }, 3000)
      }, 500);
    }
  },

  lower: function () {
    var that = this;
    if (that.data.pullLowAllow) {
      that.setData({
        pullLowAllow: false
      })
      console.log('下拉加载');
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 1000,
      });
      setTimeout(()=> {
        wx.showToast({
          title: '加载成功',
          icon: 'success',
          duration: 1000,
        });
        const datas = this._generateColors(3);
        this.setData({
          datas: [...this.data.datas, ...datas],
          pullLowAllow: true,
        });
      
      }, 1000);
    }
  },

  clickAdd: function() {
    wx.showActionSheet({
      itemList: ['添加想说的话', '添加纪念日', '添加小心愿'],
      success: function (res) {
        if (!res.cancel) {
          if(res.tapIndex==0) {
            wx.navigateTo({
              url: '../../pages/addMsg/addMsg'
            })
          } else {

          }
          console.log(res.tapIndex)
        }
      }
    });
  }
})