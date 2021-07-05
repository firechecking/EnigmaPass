// pages/passDisplay.js
const app = getApp()
var utils = require('../../utils/PassList')
Page({
  data: {
    currentInfo: [],
    add_time: '',
    _id: '',
    hasChanged: false,
    pasteStr: '',
    timer: null
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
            wx.navigateTo({
              url: `../passSetting/passSetting?id=${that.data.currentInfo._id}`
            })
        }
      }
    })
  },
  textPaste: function (e) {
    var that = this
    this.data.pasteStr += e.currentTarget.dataset.char
    wx.showToast({
      title: this.data.pasteStr,
      duration: 1500,
      icon: 'none',
      success: function () {
        if (that.timer)
          clearTimeout(that.timer)
        that.timer = setTimeout(function () {
          wx.setClipboardData({
            data: that.data.pasteStr,
            success: function (res) {
              that.data.pasteStr = ''
            }
          })
        }, 1500)
      }
    })
    console.log(this.data.pasteStr)
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
