// pages/passDisplay.js
const app = getApp()
const passList = app.globalData.passList
var utils = require('../../utils/PassList')
Page({
  data: {
    currentInfo: [],
    histories: ['0'],
    history_idx: 0,
    hasChanged: false,
    pasteStr: '',
    timer: null
  },
  refreshData: function () {
    let _histories = []
    var _passes = passList.getPassbyFatherId(this.data.father_id, true)
    _passes.forEach(function (_pass) {
      _histories.push(utils.dateFormat(_pass.add_time, "yyyy-MM-dd HH:mm:ss"))
    })

    this.setData({
      currentInfo: Object.assign({}, _passes[app.globalData.history_idx]),
      histories: _histories,
      history_idx: app.globalData.history_idx
    })
    wx.setNavigationBarTitle({
      title: passList.getPassbyFatherId(this.data.father_id, false).name
    })
  },
  savePassword: function () {
    var newPass = Object.assign({}, this.data.currentInfo)
    var newId = ''
    delete newPass['_openid']
    newPass['add_time'] = new Date()

    if (this.data.histories.length < app.globalData.history_max) {
      newId = utils.guid()
      newPass['_id'] = newId
      passList.addPasswordObj(newPass)
    } else {
      let passes = passList.getPassbyFatherId(this.data.father_id, true)
      newId = passes[passes.length - 1]._id
      passList.updatePassword(newId, newPass)
    }
    this.setData({
      'hasChanged': false
    })
    app.globalData.history_idx = 0
    this.refreshData()
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
      duration: 1300,
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
        }, 1100)
      }
    })
  },
  bindHistoryChange: function (e) {
    console.log(e)
    var newPass = passList.getPassbyFatherId(this.data.father_id, true)[e.detail.value]
    newPass = Object.assign({}, newPass)
    app.globalData.history_idx = e.detail.value
    this.setData({
      history_idx: e.detail.value,
      currentInfo: newPass,
      hasChanged: false
    })
    console.log(e.detail.value)
  },
  onLoad: function (option) {
    this.data.father_id = option.father_id
    app.globalData.history_idx = 0
    console.log('onload')
  },
  onShow: function () {
    console.log('onshow')
    this.refreshData()
  }
})