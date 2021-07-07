//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    passList: [],
    cateDisplay: { 'default': true, '邮箱': true },
    showAddCate: false,
    showAddPass: false,
    newCateId: '',
    newPassName: '',
    newPassAddr: '',
    newPassUName: '',
    slideButtons: [{
      text: '删除',
      type: 'warn',
    }, {
      text: '删除历史',
      type: 'warn',
    }],
    display_intro: false,
    scene: 1001
  },
  refreshData: function () {
    this.setData({
      passList: app.globalData.passList.getPassList()
    })
    console.log(this.data.passList.length)
    if (this.data.passList.length < 1)
      this.setData({
        display_ad: true
      })
    else
      this.setData({
        display_ad: false
      })
  },
  onLoad: function (options) {
    console.log(wx.getLaunchOptionsSync())
    if (wx.getLaunchOptionsSync().scene == 1154)
      this.setData({
        display_ad: true,
        scene: 1154
      })
    else
      this.setData({
        display_ad: false,
        scene: wx.getLaunchOptionsSync().scene
      })
    app.globalData.passList.downstreamDb().then(() => {
      this.refreshData()
    });
    // this.refreshData()
  },
  onShow: function () {
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
  selectPass: function (e) {
    wx.navigateTo({
      url: `../passDisplay/passDisplay?father_id=${e.currentTarget.dataset.father_id}`
    })
  },
  addPassword: function (e) {
    if (!(this.data.newPassName && this.data.newPassAddr && this.data.newPassUName && this.data.newCateId)) {
      wx.showToast({
        title: '信息不完整',
        icon: 'error'
      })
    }
    else {
      app.globalData.passList.addPassword(
        this.data.newPassName,
        this.data.newPassAddr,
        this.data.newPassUName,
        this.data.newCateId
      )
      this.refreshData()
      this.cancelModal()
    }
  },
  deletePass: function (e) {
    var that = this
    var info = app.globalData.passList.getPassByID(e.currentTarget.dataset.id)
    console.log(e)
    if (e.detail.index == 0)//删除当前
      wx.showModal({
        title: '慎重：删除最新密码',
        content: '删除最新密码：' + info.name + '，剩余历史记录不会被删除',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.passList.deletePassword(e.currentTarget.dataset.id)
            that.refreshData()
          }
        }
      })
    else if (e.detail.index == 1)//删除历史
      wx.showModal({
        title: '慎重：删除当前历史密码',
        content: '删除当前以及所有历史密码：' + info.name,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            app.globalData.passList.deletePasswordByFatherId(info.father_id)
            that.refreshData()
          }
        }
      })
  },
  cancelModal: function () {
    this.setData({
      showAddPass: false,
    })
  },
  updateAddName: function (e) {
    if (e.currentTarget.dataset.type == 'cateid')
      this.setData({ newCateId: e.detail.value })
    else if (e.currentTarget.dataset.type == 'name')
      this.setData({ newPassName: e.detail.value })
    else if (e.currentTarget.dataset.type == 'addr')
      this.setData({ newPassAddr: e.detail.value })
    else if (e.currentTarget.dataset.type == 'uname')
      this.setData({ newPassUName: e.detail.value })
  },
  showAddPass: function (e) {
    this.setData({
      showAddPass: true
    })
  },
  onShareAppMessage: function (obj) {
    return {
      title: '一款超酷的密码本',
      imageUrl: 'cloud://patrick-uxzpg.7061-patrick-uxzpg-1302828728/EnigmaPass/icon/share_icon.PNG',
    }
  },
  onShareTimeline: function (obj) {
    return {
      title: '一款超酷的密码本',
      imageUrl: 'cloud://patrick-uxzpg.7061-patrick-uxzpg-1302828728/EnigmaPass/icon/share_icon.PNG',
    }
  }
})