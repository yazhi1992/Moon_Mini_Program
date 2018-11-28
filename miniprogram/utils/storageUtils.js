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

module.exports = {
  isInLove: isInLove,
  setIsInLove: setIsInLove
}
