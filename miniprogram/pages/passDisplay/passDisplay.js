// pages/passDisplay.js
const app = getApp()
const passList = app.globalData.passList
var utils = require('../../utils/PassList')
Page({
  data: {
    currentInfo: [],
    _id: '',
    histories: ['00000000', '111111111'],
    history_idx: 0,
    hasChanged: false,
    pasteStr: '',
    timer: null
  },
  refreshData: function () {
    let _histories = []
    passList.getPassbyFatherId(passList.getPassByID(this.data._id).father_id, true).forEach(function (_pass) {
      _histories.push(utils.dateFormat(_pass.add_time, "yyyy-MM-dd HH:mm:ss"))
    })
    this.setData({
      _id: this.data._id,
      currentInfo: passList.getPassByID(this.data._id),
      histories: _histories
    })
    wx.setNavigationBarTitle({
      title: passList.getPassByID(this.data._id).name
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
      let passes = passList.getPassbyFatherId(passList.getPassByID(this.data._id).father_id, true)
      newId = passes[passes.length - 1]._id
      passList.updatePassword(newId, newPass)
    }
    this.setData({
      'hasChanged': false,
      'history_idx': 0,
      '_id': newId
    })
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
    var newPass = passList.getPassbyFatherId(passList.getPassByID(this.data._id).father_id, true)[e.detail.value]
    newPass = Object.assign({}, newPass)
    this.setData({
      history_idx: e.detail.value,
      currentInfo: newPass,
      _id: newPass._id,
      hasChanged: false
    })
    console.log(e.detail.value)
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
