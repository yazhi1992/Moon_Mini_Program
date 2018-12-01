const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function randomNum(n, m) {
  var random = Math.floor(Math.random() * (m - n + 1) + n);
  return random;
}

function getSuffix(path) {
  let fileName = path.lastIndexOf("."); //取到文件名开始到最后一个点的长度
  let fileNameLength = path.length; //取到文件名长度
  let fileFormat = path.substring(fileName, fileNameLength); //截
  return fileFormat;
}

//随机生成name用于上传图片
function randomImgName(imgPath) {
  return Date.parse(new Date()).toString() + '_' + randomNum(1, 1000).toString() + getSuffix(imgPath)
}

function showToast(msg) {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
    })
}

module.exports = {
  formatTime: formatTime,
    randomNum:randomNum,
  randomImgName: randomImgName,
    showToast:showToast
}
