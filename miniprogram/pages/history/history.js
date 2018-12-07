// miniprogram/pages/history/history.js

var util = require('../../utils/utils.js')
var dbUtil = require('../../utils/dbUtils.js')
var app = getApp()
const commentHint = "请输入想说的话"
const eventBus = require('../../utils/eventbus.js')
const rootStatus = require('../../utils/DRootStatus.js')
var cloud = require('../../cloud/cloud.js')
const PAGE_SIZE = 6

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeigt: 0,
    isHideLoadMore: false,
    datas: [],
    inputBottom: "0",
    tabbarHeight: 0,
    focus: false,
    inputValue: "",
    commentContent: null,
    inputHint: commentHint,
    commentReplyId: "",
    commentReplyUserName: "",
    input: "", //input 输入的值
    imgwidth: 0,
    imgheight: 0,
    needRefresh: false,
    drootStatus: rootStatus.content,
      totalSize: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.startPullDownRefresh()

    eventBus.on("refreshHistory", this.observe)

    var that = this

    wx.getSystemInfo({
      success: (res => {
        console.log(res)
        var tabbarHeight = res.screenHeight - res.windowHeight - res.statusBarHeight - 48
        that.setData({
          tabbarHeight: tabbarHeight
        })
        console.log("tabbarHeight" + that.data.tabbarHeight)
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.needRefresh) {
      wx.startPullDownRefresh()
      this.setData({
        needRefresh: false
      })
    }
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
    eventBus.off('refreshHistory', this.observe)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      drootStatus: rootStatus.content
    })
    this.fresh(true);
    console.log("onPullDownRefresh")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
      app.apiStart()
      this.fresh(false);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  fresh: function(pullDown) {
    var that = this;
    if(pullDown) {
        this.setData({
            totalSize: 0,
        })
    }
      cloud.getHistory(this.data.totalSize, PAGE_SIZE)
          .then(res => {
              console.log("fresh 成功")
              console.log(res)
              var temp = res;
              if (temp.length > 0) {
                  for (let i = 0; i < temp.length; i++) {
                      //时间格式化
                      temp[i].content.createAt = app.formatDateTime(new Date(temp[i].content.createAt).getTime());
                      //计算倒数日
                      if (temp[i].contentType == 1) {
                          temp[i].content.dayGap = that.calcDateGap(temp[i].content.timestamp)
                      }
                      //计算图片尺寸
                      if (temp[i].content.imgwidth) {
                          var width = temp[i].content.imgwidth;
                          var height = temp[i].content.imgheight;
                          var ratio = width / height;
                          if (ratio > 1) {
                              width = 400;
                              height = 400 / ratio;
                          } else {
                              height = 500;
                              width = 500 * ratio;
                          }
                          temp[i].content.imgwidth = width
                          temp[i].content.imgheight = height
                      }
                  }
                  var finalDatas = []
                  if(that.data.totalSize == 0) {
                    //下拉刷新
                      finalDatas = temp
                  } else {
                    console.log("datas")
                    console.log(that.data.datas)
                      finalDatas= that.data.datas.concat(temp)
                  }
                  console.log(finalDatas.length)
                  that.setData({
                      datas: finalDatas,
                      totalSize: finalDatas.length
                  });
              } else {
                if(that.data.datas.length==0) {
                    that.setData({
                        drootStatus: rootStatus.empty,
                    });
                }
              }
              app.apiEnd()
              wx.stopPullDownRefresh()
          }).catch(err => {
          console.log(err)
          app.apiError()
          wx.stopPullDownRefresh()
          that.setData({
              drootStatus: rootStatus.error,
          });
      })
  },

  //计算日期间隔，正数代表已过去
  calcDateGap: function(date) {
    var nowDate = new Date()
    nowDate.setHours(0, 0, 0, 0)
    var nowDateStamp = parseInt(Number(nowDate) / 1000)
    var gap = parseInt((nowDateStamp - date) / 60 / 60 / 24)
    return gap;
  },

  clickAdd: function() {
    console.log("add")
    wx.showActionSheet({
      // itemList: ['添加想说的话', '添加纪念日', '添加小心愿'],
      itemList: ['添加想说的话'],
      success: function(res) {
        if (!res.cancel) {
          var route = "";
          if (res.tapIndex == 0) {
            route = '../../pages/addMsg/addMsg';
          } else if (res.tapIndex == 1) {
            route = '../../pages/addMemorialDay/addMemorialDay';
          } else {
            route = '../../pages/addHope/addHope';
          }
          wx.navigateTo({
            url: route
          })
          console.log(res.tapIndex)
        }
      }
    });
  },

  //点击评论按钮
  addComment: function(event) {
    console.log(event.currentTarget.dataset.content);
    this.setData({
      focus: true,
      inputHint: commentHint,
      commentReplyId: "",
      commentReplyUserName: "",
      commentContent: event.currentTarget.dataset.content,
    });
  },

  //预览图片
  clickImg: function(event) {
    console.log("点击图片")
    wx.previewImage({
      current: event.currentTarget.dataset.src,
      urls: [event.currentTarget.dataset.src]
    })
  },

  longClickImg: function(event) {
    // this.longTap()
    console.log("长按图片")
    console.log(event)
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //发表评论
  sendComment: function() {
    //隐藏软键盘
    if (!this.data.inputValue) {
      wx.showToast({
        title: '内容不能为空',
        duration: 1000,
      });
      return;
    }
    var that = this;
    app.apiStart();
    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        itemId: that.data.commentContent._id,
        replyId: that.data.commentReplyId,
        comment: that.data.inputValue,
      }
    }).then(res => {
      console.log(res)
      var newDatas = that.data.datas;
      for (let i = 0; i < newDatas.length; i++) {
        if (newDatas[i]._id == that.data.commentContent._id) {
          if (!newDatas[i].comments) {
            newDatas[i].comments = [];
          }
          res.result.replyUser = {
            name: that.data.commentReplyUserName
          };
          res.result.user = app.globalData.userInfo;
          newDatas[i].comments.push(res.result);
          break;
        }
      }
      console.log(newDatas);
      //添加成功，更新数据
      that.setData({
        datas: newDatas,
        focus: false,
        input: "",
      });
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: err,
        duration: 5000,
      });
    })
  },

  inputFocus: function(e) {
    console.log(e.detail.height);
    var that = this
    console.log("tabbarHeight" + that.data.tabbarHeight)
    that.setData({
      inputBottom: (e.detail.height - that.data.tabbarHeight).toString()
    });
  },

  //点击某条评论
  clickComment: function(event) {
    console.log(event.currentTarget.dataset.content);
    console.log(event.currentTarget.dataset.comment);
    //如果是自己的评论
    var comment = event.currentTarget.dataset.comment;
    var content = event.currentTarget.dataset.content;
    var that = this;
    if (comment._openid == app.globalData.userInfo._openid) {
      //自己的评论
      wx.showModal({
        content: '是否删除该评论？',
        confirmText: "确认",
        cancelText: "取消",
        success: function(res) {
          if (res.confirm) {
            app.apiStart()
            wx.cloud.callFunction({
              name: 'removeComment',
              data: {
                itemId: content._id,
                timestamp: comment.timestamp,
              }
            }).then(res => {
              var newDatas = that.data.datas;
              for (let i = 0; i < newDatas.length; i++) {
                if (newDatas[i]._id == content._id) {
                  var newComment = newDatas[i].comments;
                  for (let j = 0; j < newComment.length; j++) {
                    if (newComment[j].timestamp == comment.timestamp) {
                      newComment.splice(j, 1);
                      break;
                    }
                  }
                  newDatas[i].comments = newComment;
                  break;
                }
              }
              console.log(newDatas);
              //添加成功，更新数据
              that.setData({
                datas: newDatas,
              })
              wx.hideLoading();
            }).catch(err => {
              console.log(err)
              app.apiError()
            })
          }
        }
      });
    } else {
      //回复
      this.setData({
        focus: true,
        inputHint: "回复 " + comment.user.name,
        commentReplyId: comment._openid,
        commentReplyUserName: comment.user.name,
        commentContent: content,
      });
    }
  },

  longTapComment: function() {

  },

  longTap: function(event) {
    console.log('长按');
    console.log(event.currentTarget.dataset.content);
    var chooseContent = event.currentTarget.dataset.content
    var that = this;
    wx.showActionSheet({
      itemList: ['删除', '取消'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.showModal({
              content: '是否删除该数据？',
              confirmText: "确认",
              cancelText: "取消",
              success: function(res) {
                if (res.confirm) {
                  app.apiStart()
                  wx.cloud.callFunction({
                    name: 'removeHistory',
                    data: {
                      itemId: chooseContent._id,
                    }
                  }).then(res => {
                    console.log(res)
                    var temp = that.data.datas;
                    for (let i = 0; i < temp.length; i++) {
                      if (temp[i]._id == chooseContent._id) {
                        temp.splice(i, 1);
                        break;
                      }
                    }
                    //添加成功，更新数据
                    that.setData({
                      datas: temp
                    })
                    if (temp.length == 0) {
                      //数据为空
                      that.setData({
                        drootStatus: rootStatus.empty
                      })
                    }
                    app.apiEnd()
                  }).catch(err => {
                    console.log(err)
                    app.apiError()
                  })
                }
              }
            });
          }
        }
      }
    });
  },

  inputBlur: function() {
    this.setData({
      inputBottom: '0'
    });
  },

  observe: function(arg) {
    console.log('收到刷新通知')
    this.setData({
      needRefresh: true
    })
  },

  drootCallback: function(event) {
    var status = event.detail.status;
    if (status == rootStatus.error || status == rootStatus.empty) {
      wx.startPullDownRefresh()
    }
  },

})
