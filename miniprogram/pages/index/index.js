//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    passCate: [
      { title: 'default', passes: [{ 'uuid': '1', 'name': 'baidu' }, { 'uuid': '2', 'name': 'alibaba'}], display: false },
      { title: '邮箱', passes: [{ 'uuid': '3', 'name': 'tencent' }, { 'uuid': '5', 'name': 'pdd' }], display: true }
    ]
  },
  tapCate: function (e) {
    var idx = e.currentTarget.dataset.index
    let temp = this.data.passCate
    temp[idx].display = !temp[idx].display
    this.setData({
      passCate: temp
    })
  },
  selectPass: function(e){
    wx.navigateTo({
      url: '../passDisplay/passDisplay?uuid=${e.currentTarget.dataset.uuid}'
    })
  }
})
