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

function saveInLove(isIn) {
  wx.setStorageSync('inlove', isIn)
}

function saveOpenId(openId) {
  wx.setStorageSync('openId', openId)
}

function getOpenId() {
  return getValue("openId")
}

function saveLoverId(id) {
  wx.setStorageSync('loverId', id)
}

function getLoverId() {
  return getValue("loverId")
}

module.exports = {
  isInLove: isInLove,
  saveInLove: saveInLove,
  getOpenId: getOpenId,
  saveOpenId: saveOpenId,
  saveLoverId: saveLoverId,
  getLoverId: getLoverId,
}