//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    passList: [],
    cateDisplay:{'default':false,'邮箱':true}
  },
  refreshData:function(){
    this.setData({
      passList:app.globalData.passList.getPassList()
    })
  },
  onLoad:function(options){
    this.refreshData()
  },
  tapCate: function (e) {
    var name = e.currentTarget.dataset.name
    let temp = this.data.cateDisplay
    temp[name] = !temp[name]
    this.setData({
      cateDisplay: temp
    })
  },
  selectPass: function(e){
    wx.navigateTo({
      url: `../passDisplay/passDisplay?uuid=${e.currentTarget.dataset.uuid}`
    })
  }
})
