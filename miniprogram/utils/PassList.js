
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
    this.category.push({ 'name': name, '_id': '', 'passes': [] })
    this.decodeDatabase(this.category, this.password)
  }
  addPassword(passname, catename) {
    this.password.push({
      '_id': '5', 'add_time': new Date(), 'address': '', 'cate_id': this.category[0]._id, 'father_id': '',
      'name': passname, 'password': '', 'settings': {}, 'username': ''
    })
    this.decodeDatabase(this.category, this.password)
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