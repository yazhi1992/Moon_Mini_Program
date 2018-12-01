function getValue(key) {
  var result = null
  try {
    var value = wx.getStorageSync(key)
    if (value) {
      result = value;
    }
  } catch (e) {}
  return result
}

function isInLove() {
  var result = false
  try {
    var value = wx.getStorageSync('inlove')
    if (value) {
      result = value;
    }
  } catch (e) {
    // Do something when catch error
  }
  return
}

function setIsInLove(isIn) {
  wx.setStorageSync('inlove', isIn)
}

function saveOpenId(openId) {
  wx.setStorageSync('openId', openId)
}

function getOpenId() {
  return getValue("openId")
}

module.exports = {
  isInLove: isInLove,
  setIsInLove: setIsInLove,
  getOpenId: getOpenId,
  saveOpenId: saveOpenId,

}