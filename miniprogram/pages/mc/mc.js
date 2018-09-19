// pages/mc/mc.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseData: null,
    showAddBtn: false,
    daysColor: [],
      days:[],
      year:2018,
      month: 9,
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

  dayClick: function(event) {
    this.setData({
      chooseData: event.detail,
      showAddBtn: true
    })
    console.log(event.detail);
  },

    //更新日期数组
    updateDays: function (event) {
        console.log(event.detail.days);
        var temp = new Array;
        for (let i = 0; i < event.detail.days.length; i++) {
            let item = event.detail.days[i];
            for (let j = 0; j < item.length; j++) {
                temp.push(item[j])
            }
        }
        console.log(temp);
        this.setData({
            year:event.detail.year,
            month:event.detail.month,
            days: temp
        })

        this.syncMcData();
    },

    syncMcData: function() {
      var that = this
        app.apiStart()
        console.log("同步mc数据：" + this.data.year + "-" + this.data.month)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'getMc',
      // 传递给云函数的event参数
      data: {
        year: this.data.year,
        month: this.data.month
      }
    }).then(res => {
        if(res.result) {
            that.setData({
                daysColor:that.calcuDaysColor(res.result)
            });
        }
        wx.hideLoading()
    }).catch(err => {
        console.log(err)
      app.apiError()
    })
  },

  calcuDaysColor: function(mcDays) {
      var month = this.data.month;
      var days = this.data.days;
    var lastComeIndex = Number.MAX_VALUE;
    var lastCircleIndex = 0;
    var colors = new Array;
    for (let i = 0; i < mcDays.length; i++) {
      if (i == 0) {
        if (mcDays[0].month != month && mcDays[0].action == 1 && mcDays[1].action == 2) {
          //从1号开始所有都标记
          lastComeIndex = 0;
          continue;
        }
      }
        const item = mcDays[i];
        if (item.action == 1) {
          // 发现来，标记即可。
          lastComeIndex = item.day;
            lastCircleIndex = item.day;
          colors.push({
            month: item.month,
            day: item.day,
            action: item.action,
            background: "#567ddd"
          });
          continue;
        }
        //去
        if (item.action == 2) {
          for (let j = 0; j < days.length; j++) {
            if (days[j].month != month) {
              //跳过非本月
              continue;
            }
            if (days[j].day <= lastCircleIndex) {
              //跳过之前已遍历过的
              continue;
            }
            if (days[j].day == item.day && days[j].month == item.month) {
              colors.push({
                month: item.month,
                day: item.day,
                action: item.action,
                background: "#986c7f"
              });
              lastComeIndex = Number.MAX_VALUE;
              lastCircleIndex = days[j].day;
              break;
            }
            if (days[j].day > lastComeIndex) {
              //中间的日子
              colors.push({
                month: days[j].month,
                day: days[j].day,
                action: 3,
                background: "#315417"
              })
            }
          }
        }
      }
      console.log(colors);
    return colors;
  },

  clickAdd: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['姨妈来了', '姨妈走了'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.showConfirmDialog(1, that.data.chooseData)
          } else {
            that.showConfirmDialog(2, that.data.chooseData)
          }
        }
      }
    });
  },

  showConfirmDialog: function(action, chooseData) {
      var that = this;
    wx.showModal({
      content: '选中日期：' + chooseData.year + '年' + chooseData.month + '月' + +chooseData.day + '日\r\n是否新增状态？',
      // content: 'asdfasdf',
      confirmText: "确认",
      cancelText: "取消",
      success: function(res) {
        if (res.confirm) {
          app.apiStart()
          wx.cloud.callFunction({
            // 要调用的云函数名称
            name: 'addMc',
            // 传递给云函数的event参数
            data: {
              year: chooseData.year,
              month: chooseData.month,
              day: chooseData.day,
              action: action
            }
          }).then(res => {
              //添加成功，更新数据
              that.syncMcData()
          }).catch(err => {
              console.log(err)
            app.apiError()
          })
        }
      }
    });
  },
})