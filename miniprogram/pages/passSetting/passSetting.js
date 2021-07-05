// miniprogram/pages/passSetting/passSetting.js
const app = getApp()
var utils = require('../../utils/PassList')
Page({
  data: {
    _id: "",
    key: ['row', 'column', 'dict', 'cate_id', 'username', 'address'],
    value: [15, 10, 'dsfds', 'default', 'uname', 'httpxxx'],
    showType: ['number', 'number', 'textarea', 'input', 'input', 'input'],
    desc: ['密码本行数(建议15)', '密码本列数(建议10)', '密码本词典', "分组", '登陆用户名', "网站描述"],
    tempValue: {}
  },
  refreshData: function () {
    var _dict = app.globalData.passList.getPassByID(this.data._id)
    for (var key in _dict) {
      var idx = this.data.key.indexOf(key)
      if (idx > -1) {
        this.data.value[idx] = _dict[key]
        this.data.tempValue[idx] = _dict[key]
      }
    }
    _dict = _dict.settings
    for (var key in _dict) {
      var idx = this.data.key.indexOf(key)
      if (idx > -1) {
        this.data.value[idx] = _dict[key]
        this.data.tempValue[idx] = _dict[key]
      }
    }
    this.setData({
      value: this.data.value,
      tempValue: this.data.tempValue
    })
  },
  onChangeSettingValue: function (e) {
    // console.log(e)
    if (this.data.showType[e.currentTarget.dataset.key] == 'number')
      this.data.tempValue[e.currentTarget.dataset.key] = parseInt(e.detail.value)
    else
      this.data.tempValue[e.currentTarget.dataset.key] = e.detail.value
    // console.log(this.data.tempValue)
  },
  updateSettings: function (e) {
    var _pass = app.globalData.passList.getPassByID(this.data._id)
    for (var key in _pass) {
      var idx = this.data.key.indexOf(key)
      if (idx > -1)
        _pass[key] = this.data.tempValue[idx]
    }
    for (var key in _pass.settings) {
      var idx = this.data.key.indexOf(key)
      if (idx > -1)
        _pass.settings[key] = this.data.tempValue[idx]
    }
    app.globalData.passList.updatePassword(this.data._id, _pass)
    this.refreshData()
    wx.navigateBack()
  },
  resetSettings: function () {
    for (let i = 0; i < this.data.value.length; i++) {
      this.data.tempValue[i] = this.data.value[i]
    }
    this.refreshData()
  },
  onLoad: function (option) {
    this.data._id = option.id
  },
  onShow: function () {
    console.log('onshow')
    this.refreshData()
  }
})