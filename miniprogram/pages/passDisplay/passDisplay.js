// pages/passDisplay.js
const app = getApp()
Page({
  data: {

  },
  onLoad: function(option){
    console.log(option)
    let uuid = option.uuid
    var passList = app.globalData.passList;
    console.log(passList.getPassByUUID(uuid))
  }
})
