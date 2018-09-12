// components/header.js
const App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title_height: {
      type: String,
      value: App.globalData.navHeight
    },
    is_trans: {
      type: Boolean,
      value: false
    },
    show_back: {
      type: Boolean,
      value: true
    },
    show_title: {
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
  }
})