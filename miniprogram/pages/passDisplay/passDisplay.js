// pages/passDisplay.js
const app = getApp()
var utils = require('../../utils/PassList')
Page({
  data: {
    currentInfo: [],
    add_time: '',
    _id: '',
    hasChanged: false
  },
  refreshData: function () {
    var passList = app.globalData.passList;
    wx.setNavigationBarTitle({
      title: passList.getPassByID(this.data._id).name
    })
    this.setData({
      _id: this.data._id,
      currentInfo: passList.getPassByID(this.data._id),
      add_time: passList.getPassByID(this.data._id).add_time.toString()
    })
  },
  savePassword: function () {
    app.globalData.passList.updatePassword(this.data._id, this.data.currentInfo)
    this.setData({
      'hasChanged': false
    })
  },
  showOptionSheet: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['重新生成密码', '修改配置'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            var newPass = utils.randstr(that.data.currentInfo.settings.row * that.data.currentInfo.settings.column,
              that.data.currentInfo.settings.dict)
            that.setData({
              'currentInfo.password': newPass,
              'hasChanged': true
            })
          }
          if (res.tapIndex == 1)
            console.log(res)
        }
      }
    })
  },
  onLoad: function (option) {
    this.data._id = option.id
    // this.refreshData()
  },
  onShow: function () {
    console.log('onshow')
    this.refreshData()
  }
})
