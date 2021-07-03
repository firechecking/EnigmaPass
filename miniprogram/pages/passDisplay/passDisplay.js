// pages/passDisplay.js
const app = getApp()
Page({
  data: {
    currentInfo: []
  },
  onLoad: function (option) {
    let uuid = option.uuid
    var passList = app.globalData.passList;
    this.setData({
      currentInfo: passList.getPassByUUID(uuid)
    })
  }
})
