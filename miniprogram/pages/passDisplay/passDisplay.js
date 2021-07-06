// pages/passDisplay.js
const app = getApp()
var utils = require('../../utils/PassList')
Page({
  data: {
    currentInfo: [],
    add_time: '',
    _id: '',
    hasChanged: false,
    copyStr: '',
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
      add_time: utils.dateFormat(passList.getPassByID(this.data._id).add_time,"yyyy-MM-dd HH:mm:ss")
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
  textCopy: function (e) {
    var that = this
    this.data.copyStr += e.currentTarget.dataset.char
    wx.showToast({
      title: this.data.copyStr,
      duration: 1300,
      icon: 'none',
      success: function () {
        if (that.timer)
          clearTimeout(that.timer)
        that.timer = setTimeout(function () {
          wx.setClipboardData({
            data: that.data.copyStr,
            success: function (res) {
              that.data.copyStr = ''
            }
          })
        }, 1100)
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
  },
  onShareAppMessage: function (obj) {
    return {
      title: '分享我的密码',
    }
  },
  onShareTimeline: function (obj) {
    return {
      title: '分享我的密码',
      imageUrl: 'cloud://patrick-uxzpg.7061-patrick-uxzpg-1302828728/EnigmaPass/icon/share_icon.PNG',
    }
  }
})
