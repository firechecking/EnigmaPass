//index.js
const app = getApp()
const { envList } = require('../../envList.js')

Page({
  data: {
    passList: [],
    cateDisplay: { 'default': true, '邮箱': true },
    showAddCate: false,
    showAddPass: false,
    newCateName: '请输入分组名称',
    newPassName: '请输入密码显示名称'
  },
  refreshData: function () {
    this.setData({
      passList: app.globalData.passList.getPassList()
    })
  },
  onLoad: function (options) {
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
      url: `../passDisplay/passDisplay?uuid=${e.currentTarget.dataset.uuid}`
    })
  },
  addCategory: function (e) {
    console.log(this.data.newCateName)
    this.cancelModal()
  },
  addPassword: function (e) {
    console.log(this.data.newCateName)
    console.log(this.data.newPassName)
    this.cancelModal()
  },
  cancelModal: function () {
    this.setData({
      newCateName:'',
      newPassName:'',
      showAddCate: false,
      showAddPass: false,
    })
  },
  updateAddName: function (e) {
    if (e.currentTarget.dataset.type == 'cate')
      this.setData({ newCateName: e.detail.value })
    else if (e.currentTarget.dataset.type == 'pass')
      this.setData({ newPassName: e.detail.value })
  },
  showAddSheet: function (e) {
    var that = this
    wx.showActionSheet({
      itemList: ['新建分组', '新建密码'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex==0)
            that.setData({
              showAddCate:true,
              showAddPass:false
            })
          if (res.tapIndex==1)
          that.setData({
            showAddCate:false,
            showAddPass:true
          })
        }
      }
    })
  }
})
