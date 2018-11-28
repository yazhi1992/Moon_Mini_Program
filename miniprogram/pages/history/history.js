// miniprogram/pages/history/history.js

var util = require('../../utils/util.js')
var sUtil = require('../../utils/storageUtils.js')
var app = getApp()
const commentHint = "请输入想说的话"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeigt: 0,
    pullUpAllow: true,
    isHideLoadMore: false,
    datas: [],
    inputBottom: "0",
    focus: false,
    inputValue: "",
    commentContent: null,
    inputHint: commentHint,
    commentReplyId: "",
    commentReplyUserName: "",
    input: "", //input 输入的值
    imgwidth: 0,
    imgheight: 0.
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.startPullDownRefresh()
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
    this.fresh();
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

  upper: function() {
    var that = this
    // var timestamp = Date.parse(new Date()) / 1000;
    // var lastTime = this.data.lastLoadTime
    // if (timestamp - lastTime < 0) {
    //     console.log('太快了')
    // } else {
    //     that.setData({ lastLoadTime: timestamp })
    if (that.data.pullUpAllow) {
      console.log('刷新')
      this.fresh();
    }
  },

  fresh: function(refresh, date) {
    var that = this;
    this.setData({
      pullUpAllow: false,
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getHistory',
      // 传递给云函数的event参数
      data: {
        year: 2018,
      }
    }).then(res => {
      app.apiEnd();
      console.log(res)
      var temp = res.result;
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
      wx.stopPullDownRefresh()
      that.setData({
        datas: temp,
      });
    }).catch(err => {
      console.log(err)
      app.apiError()
      wx.stopPullDownRefresh()
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
    wx.showActionSheet({
      itemList: ['添加想说的话', '添加纪念日', '添加小心愿'],
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
    that.setData({
      inputBottom: (e.detail.height).toString()
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
                    wx.hideLoading();
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

  bindFormSubmit: function(e) {
    var that = this;
    var content = e.detail.value.textarea;
    app.apiStart()
    if (that.data.pickImg) {
      //有图片先上传
      var uploadFileName = Date.parse(new Date()).toString() + '_' + app.randomNum(1, 1000).toString() + app.getSuffix(that.data.previewImg[0])
      console.log(uploadFileName)
      wx.cloud.uploadFile({
        cloudPath: uploadFileName, // 上传至云端的路径
        filePath: that.data.previewImg[0], // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          console.log(res.fileID)
          this.addMsg(res.fileID, content)
        },
        fail: res => {
          console.log(res);
          app.apiError();
        }
      })
    } else {
      this.addMsg(null, content)
    }
  },

  imageLoad: function(e) {
    var width = e.detail.width;
    var height = e.detail.height;
    var ratio = width / height;
    if (ratio > 1) {
      width = 400;
      height = 400 / ratio;
    } else {
      height = 500;
      width = 500 * ratio;
    }
    this.setData({
      imgwidth: width,
      imgheight: height,
    })
  }

})