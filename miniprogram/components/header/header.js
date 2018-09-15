// components/header.js
const App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleHeight: {
      type: String,
      value: App.globalData.navHeight
    },
    isTrans: {
      type: Boolean,
      value: false
    },
    showBack: {
      type: Boolean,
      value: true
    },
    showTitle: {
      type: Boolean,
      value: true
    },
    title: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    // 返回上一页面
    _navback() {
      wx.navigateBack()
    },

    clickBack: function () {
      wx.navigateBack()
    }
  },
  
})