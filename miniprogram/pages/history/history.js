// miniprogram/pages/history/history.js

var util = require('../../utils/util.js')
var app = getApp()
const commentHint = "请输入想说的话"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeigt: 0,
    pullUpAllow: true,
    pullLowAllow: true,
    isHideLoadMore: false,
    datas: [],
    inputBottom: "0",
    tabbarHeight: 0,
    focus: false,
      inputValue: "",
      commentContent: null,
      inputHint: commentHint,
      commentReplyId: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var height_02 = res.screenHeight - res.windowHeight;
        console.log('getSystemInfo')
        that.setData({
          tabbarHeight: height_02
        });
      }
    });
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
    app.apiStart();
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
        temp[i].content.createAt = app.formatDateTime(temp[i].content.createAt.$date);
      }
      that.setData({
        pullUpAllow: true,
        datas: temp,
      });
    }).catch(err => {
      console.log(err)
      app.apiError()
      that.setData({
        pullUpAllow: true
      })
    })
  },

  lower: function() {
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
      setTimeout(() => {
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
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: '../../pages/addMsg/addMsg'
            })
          } else {

          }
          console.log(res.tapIndex)
        }
      }
    });
  },

  addComment: function(event) {
    console.log('clickComment content');
    console.log(event.currentTarget.dataset.content);
    this.setData({
      focus: true,
        inputHint: commentHint,
        commentReplyId: "",
        commentContent: event.currentTarget.dataset.content,
    });
  },

    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },

    sendComment: function() {
        //隐藏软键盘
        if(!this.data.inputValue) {
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
                if(newDatas[i]._id == that.data.commentContent._id) {
                    newDatas[i].comments.push(res.result);
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
            wx.showToast({
                title: err,
                duration: 5000,
            });
            // app.apiError()
        })
    },

  inputFocus: function(e) {
    console.log(e.detail.height);
    console.log(this.data.tabbarHeight)
    this.setData({
      inputBottom: (e.detail.height - this.data.tabbarHeight).toString()
    });
  },

  clickComment: function(event) {
    console.log('点击评论');
    console.log(event.currentTarget.dataset.comment);
    //如果是自己的评论
      var comment = event.currentTarget.dataset.comment;
      //todo
      if(comment._openid = "me") {
          wx.showModal({
              content: '是否删除该评论？',
              confirmText: "确认",
              cancelText: "取消",
              success: function(res) {
                  if (res.confirm) {
                      // app.apiStart()
                      // wx.cloud.callFunction({
                      //     name: 'removeMc',
                      //     data: {
                      //         itemId: chooseData._id,
                      //     }
                      // }).then(res => {
                      //     console.log(res)
                      //     var temp = that.data.mcDays;
                      //     console.log('old')
                      //     console.log(temp)
                      //     for (let i = 0; i < temp.length; i++) {
                      //         if(temp[i]._id == chooseData._id) {
                      //             temp.splice(i,1);
                      //         }
                      //     }
                      //     console.log('new')
                      //     console.log(temp)
                      //     //添加成功，更新数据
                      //     that.setData({
                      //         mcDays: temp,
                      //         daysColor:that.calcuDaysColor(temp)
                      //     })
                      //     wx.hideLoading();
                      // }).catch(err => {
                      //     console.log(err)
                      //     app.apiError()
                      // })
                  }
              }
          });
      } else {
        //回复

      }
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
                          if(temp[i]._id == chooseContent._id) {
                              temp.splice(i,1);
                              break;
                          }
                      }
                      //添加成功，更新数据
                      that.setData({
                          datas:temp
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

})