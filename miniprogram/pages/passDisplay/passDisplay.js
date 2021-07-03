// pages/passDisplay.js
const app = getApp()
Page({
  data: {
    currentInfo: [],
    add_time:''
  },
  onLoad: function (option) {
    let _id = option.id
    var passList = app.globalData.passList;
    this.setData({
      currentInfo: passList.getPassByID(_id),
      add_time:passList.getPassByID(_id).add_time.toString()
    })
  }
})
