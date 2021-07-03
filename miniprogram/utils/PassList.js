const col_cate = 'ep_category'
const col_pass = 'ep_password'
const default_settings = { 'row': 15, 'column': 10, 'dict': '0123456789fghjkmnpqrtuvwxyzDEFGMNPQRSTUVW~!@#$%^&*()_+{};<>,.' }

function guid() {
  return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
function randstr(num, dic) {
  var max = dic.length, min = 1;
  var sb = '';
  for (var i = 0; i < num; i++) {
    var number = Math.floor(Math.random() * (max - min) + min);
    sb += dic.charAt(number);
  }
  return sb.toString();
}
class PassList {
  constructor(url, parameter) {
    this.db = wx.cloud.database();
    this.category = [];
    this.password = [];
  }
  async downloadCollection(colname) {
    const db = wx.cloud.database()
    const MAX_LIMIT = 100
    const countResult = await db.collection(colname).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(colname).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  }
  async downstreamDb() {
    var res = await this.downloadCollection('ep_category')
    this.category = res.data;
    res = await this.downloadCollection('ep_password')
    this.password = res.data
    var that = this
    return new Promise((resolve) => {
      that.decodeDatabase(that.category, that.password)
      resolve()
    })
  }
  decodeDatabase(category, password) {
    var data = new Array;
    category.forEach(function (cate) {
      var _list = new Array;
      password.forEach(function (pass) {
        if (pass.cate_id == cate._id) {
          _list.push(pass)
        }
      })
      data.push({ 'title': cate.name, '_id': cate._id, 'passes': _list })
    })
    this.data = data
  }
  getCategory() {
    return this.category
  }
  getPasswordByCategory(catId) {
    var passes = new Array;
  }
  getPassList() {
    return this.data;
  }
  addCategory(name) {
    var newData = { 'name': name, '_id': guid() }
    this.category.push(newData)
    this.decodeDatabase(this.category, this.password)
    wx.cloud.database().collection(col_cate).add({ data: newData })
  }
  addPassword(name, addr, uname, cateid) {
    var newData = {
      '_id': guid(), 'add_time': new Date(), 'address': addr, 'cate_id': cateid, 'father_id': '',
      'name': name, 'username': uname, 'password': randstr(default_settings.row * default_settings.column, default_settings.dict), 'settings': default_settings,
    }
    this.password.push(newData)
    this.decodeDatabase(this.category, this.password)
    wx.cloud.database().collection(col_pass).add({ data: newData })
  }
  getPassByID(_id) {
    var r_pass = null
    this.data.forEach(function (ps) {
      ps.passes.forEach(function (pass) {
        if (pass._id == _id)
          r_pass = pass
      })
    });
    return r_pass
  }
}
export { PassList }