var DRootStatus = require("../../utils/DRootStatus.js");

Component({

  properties: {
    status: {
      type: Number,
      value: DRootStatus.content
    },
    loadingTransparent: {
      type: Boolean,
      value: true
    }
  },
  data: {
    error: DRootStatus.error,
    empty: DRootStatus.empty,
    loading: DRootStatus.loading,
    content: DRootStatus.content,

    errorLayoutData: {
      status: DRootStatus.error,
      src: "./icon_empty_error.png",
      prompt: "加载出错了",
      btnPrompt: "重新加载"
    },
    emptyLayoutData: {
      status: DRootStatus.empty,
      src: "./icon_empty_empty.png",
      prompt: "数据为空",
      btnPrompt: "重新加载"
    },
    loadingLayoutData: {
      status: DRootStatus.loading,
      src: "./icon_empty_loading.png",
      prompt: "加载中...",
      btnPrompt: null
    }
  },
  methods: {
    // 空布局中点击回调， 如点击重新加载按钮
    // var status = event.detail.status;

    emptyCallback: function(event) {
      var status = event.currentTarget.dataset.type;
      var detail = {
        status: status
      }
      var option = {}
      this.triggerEvent("droottap", detail, option)
    },

  }
})