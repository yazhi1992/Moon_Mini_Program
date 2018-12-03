// miniprogram/pages/invite/invite.js
const app = getApp();
var cloud = require('../../cloud/cloud.js')
var utils = require('../../utils/utils.js')
var dbUtils = require('../../utils/dbUtils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myBindCode: "", //我的邀请码
    waitingAccept: false, //是否等待对方接受
    showUser: false, //邀请码对应的用户

    showAskMeUser: false, //邀请我的用户

    myBindCode: "", //我的邀请码

    peerName: "",
    peerImgUrl: "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJEYuE856Sk982HQd0ghLPPI5UicXXTl5qmCsBUhetbePsOg7BzLXTTH8iaOJx1E3BdeFRqGHl6MLFQ/132",
    peerCode: "",

    askMeUserName: "",
    askMeUserImgUrl: "",

    peerId: "",
    loading: true,

    myWantId: "", //我喜欢的人的id

  },
  // 邀请页
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("invite " + options.id)
    if (options.id) {
      this.setData({
        peerId: options.id
      })
    }
    this.clickRefresh()
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
    return {
      title: 'test share', //转发标题
      path: "pages/homepage/homepage?id=myidhahaha" //转发路径
    }
  },

  //复制邀请码
  clickCopy: function() {
    wx.setClipboardData({
      data: this.data.myBindCode.toString(),
      success(res) {
        utils.showToast("已复制到剪贴板")
      }
    })
  },

  //取消绑定
  clickCancel: function() {
    app.apiStart()
    cloud.cancelBind(this.data.peerCode)
      .then(res => {
        this.setData({
          waitingAccept: false,
          showUser: false
        })
        app.apiEnd()
      })
      .catch(err => {
        app.apiError()
      })
  },

  //刷新
  clickRefresh: function() {
    app.apiStart()
    cloud.getUserInfo()
      .then(res => {
        console.log("自己的userInfo")
        console.log(res)
        if (res.data.inLove) {
          //finish
          console.log("inlove!!!退出")
        } else {
          //用户peerCode字段有值，则查询对方是否同意了自己发出的请求
          if (res.data.peerCode) {
            console.log("等待对方同意中。查询对方信息 先查询 code 的信息，peerCode " + res.data.peerCode)
            this.setData({
              waitingAccept: true,
              peerCode: res.data.peerCode
            })
            //等待对方同意中，获取对方的信息
            var myInfo = res.data
            return cloud.getBindCode(res.data.peerCode)
              .then(res => {
                var requesterOfPeerCode = res.data[0].requester
                if (!Boolean(requesterOfPeerCode) || requesterOfPeerCode != dbUtils.getOpenId()) {
                  console.log("对方拒绝了您的绑定请求")
                  //自己发出的请求已被拒绝
                  wx.showModal({
                    content: '对方拒绝了您的绑定请求',
                    showCancel: false,
                    success: function(res) {}
                  });
                  return myInfo
                } else {
                  console.log("查询 code 的信息，获取对方的 openid " + res.data[0].creater)
                  return this.updatePeerinfo(res.data[0].creater)
                    .then(res => {
                      return myInfo
                    })
                }
              })
          } else {
            console.log("自己没有发出请求")
            return res.data
          }
        }
      })
        .then(res => {
            //查询是否有人请求绑定我
            if (res.bindCode) {
                console.log("已有 bindCode")
              this.setData({
                myBindCode: res.bindCode
              })
                return res
            } else {
                console.log("没有 bindCode，准备生成")
                var userInfo = res
                return cloud.newBindCode()
                    .then(res => {
                      console.log(res)
                        console.log("已生成 bindCode")
                      this.setData({
                        myBindCode: res
                      })
                      return userInfo
                    })
            }
        })
      .then(res => {
        //查询是否有人请求绑定我
        console.log("查询 myCode 信息，看是否有人请求绑定我，mycode " + this.data.myBindCode)
        return cloud.getBindCode(this.data.myBindCode)
          .then(res => {
            if (res.data[0].requester) {
              //有人请求绑定我
              console.log("有人请求绑定我，查询该用户信息")
              return cloud.getUserInfoById(res.data[0].requester)
                .then(res => {
                  console.log(res)
                  this.setData({
                    askMeUserName: res.data.name,
                    askMeUserImgUrl: res.data.imgUrl,
                    showAskMeUser: true,
                  })
                  return new Promise((resolve, reject) => {
                    resolve(res.data)
                  })
                })
            } else {
              console.log("没人请求绑定我")
              return res
            }
          })
      })
      .then(res => {
        console.log("刷新结束")
        app.apiEnd()
        this.setData({
          loading: false
        })
      })
      .catch(err => {
        app.apiEnd()
      })
  },

  //请求绑定对方
  clickRequest: function() {
    wx.showModal({
      title: '提示',
      content: '对方如果同意您的请求后，将直接绑定双方的关系且不可取消。请确认是否发出请求？',
      success(res) {
        if (res.confirm) {
          app.apiStart()
          cloud.requestBind(this.data.peerCode)
            .then(res => {
              this.setData({
                waitingAccept: true
              })
              app.apiEnd()
            })
            .catch(err => {
              utils.showToast(err)
              app.apiEnd()
            })
        }
      }
    })
  },

  updatePeerinfo: function(peerId) {
    return cloud.getUserInfoById(peerId)
      .then(res => {
        console.log("getUserInfoById")
        console.log(res)
        this.setData({
          peerName: res.data.name,
          peerImgUrl: res.data.imgUrl,
          showUser: true,
        })
        return new Promise((resolve, reject) => {
          console.log("updatePeerinfo")
          console.log(res.data)
          resolve(res.data)
        })
      })
  },

  //获取对方信息
  bindFormSubmit: function(e) {
    var that = this;
    var code = e.detail.value.textarea;
    app.apiStart()
    cloud.getBindCode(code)
      .then(res => {
        if (res.data.length > 0) {
          that.setData({
            peerCode: code
          })
          return that.updatePeerinfo(res.data[0].creater)
            .then(res => {
              console.log(res)
              app.apiEnd()
            })
        } else {
          utils.showToast("请检查邀请码是否正确")
          app.apiEnd()
        }
      })
      .catch(err => {
        app.apiError()
      })
  },

  //拒绝
  clickReject: function() {
    app.apiStart()
    cloud.rejectBind(this.data.myBindCode)
      .then(res => {
        this.setData({
          showAskMeUser: false
        })
        app.apiEnd()
      })
      .catch(err => {
        app.apiError()
      })
  },

  //接受
  clickAccept: function() {
    wx.showModal({
      title: '提示',
      content: '该操作将直接绑定双方的关系且不可取消。请确认是否接受该请求？',
      success(res) {
        if (res.confirm) {
          app.apiStart()
          cloud.requestBind(this.data.peerCode)
            .then(res => {
              this.setData({
                waitingAccept: true
              })
              app.apiEnd()
            })
            .catch(err => {
              utils.showToast(err)
              app.apiError()
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})
