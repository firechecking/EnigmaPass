//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    passList: [],
    category: [],
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
    }]
  },
  refreshData: function () {
    console.log(app.globalData.passList.category)
    this.setData({
      passList: app.globalData.passList.getPassList(),
      category: app.globalData.passList.category
    })
  },
  onLoad: function (options) {
    app.globalData.passList.downstreamDb().then(() => {
      this.refreshData()
    });
    // this.refreshData()
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
      url: `../passDisplay/passDisplay?id=${e.currentTarget.dataset.id}`
    })
  },
  addCategory: function (e) {
    app.globalData.passList.addCategory(this.data.newCateId)
    this.refreshData()
    console.log(this.data.newCateId)
    this.cancelModal()
  },
  addPassword: function (e) {
    app.globalData.passList.addPassword(
      this.data.newPassName,
      this.data.newPassAddr,
      this.data.newPassUName,
      this.data.newCateId
    )
    this.refreshData()
    this.cancelModal()
  },
  deletePass: function (e) {
    var that = this
    var info = app.globalData.passList.getPassByID(e.currentTarget.dataset.id)
    wx.showModal({
      title: '删除确认',
      content: '是否删除密码' + info.name + '，及其所有历史记录',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          app.globalData.passList.deletePassword(e.currentTarget.dataset.id)
          that.refreshData()
        }
      }
    })
  },
  cancelModal: function () {
    this.setData({
      newCateId: '',
      newPassName: '',
      newPassAddr: '',
      newPassUName: '',
      showAddCate: false,
      showAddPass: false,
    })
  },
  updateAddName: function (e) {
    if (e.currentTarget.dataset.type == 'catename')
      this.setData({ newCateId: e.detail.value })
    else if (e.currentTarget.dataset.type == 'cateid')
      this.setData({ newCateId: e.detail.id })
    else if (e.currentTarget.dataset.type == 'name')
      this.setData({ newPassName: e.detail.value })
    else if (e.currentTarget.dataset.type == 'addr')
      this.setData({ newPassAddr: e.detail.value })
    else if (e.currentTarget.dataset.type == 'uname')
      this.setData({ newPassUName: e.detail.value })
  },
  showAddSheet: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: ['新建分组', '新建密码'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0)
            that.setData({
              showAddCate: true,
              showAddPass: false
            })
          if (res.tapIndex == 1)
            that.setData({
              showAddCate: false,
              showAddPass: true
            })
        }
      }
    })
  }
})
