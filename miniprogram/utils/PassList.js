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
    this.password = [{ "_id": "1", "name": "alibaba", "username": "贤人", "address": "www.alibaba-inc.com", "cate_id": "网站", "father_id": "", "password": ",@Vj.ka$!YkKF8k41hak,.h;5D11;.1ls4f13d#f65lVV2kjs$hF5#488;!j7S4sF#D2ldS1KgKV!ssS$#g$.@9V7k.@h3@s!F,DDh49g34j@F0V7f!dl@@05;s#Dk13,6K5KaF#7l.,sflkD;alFDa", "settings": { "row": 15, "column": 10, "dict": "0123456789fghjkmnpqrtuvwxyzDEFGMNPQRSTUVW~!@#$%^&*()_+{};<>,." }, "add_time": "2021-07-03 18:27:56"}];
    this.decodeDatabase(this.password)
  }
  async _downloadCollection(colname) {
    const db = wx.cloud.database()
    const MAX_LIMIT = 100
    const countResult = await db.collection(colname).count()
    const total = countResult.total
    if (total < 1)
      return { data: [] }
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
    var res = await this._downloadCollection('ep_password')
    this.password = res.data
    var that = this
    return new Promise((resolve) => {
      that.decodeDatabase(that.password)
      resolve()
    })
  }
  decodeDatabase(password) {
    var category = []
    var data = new Array;
    password.forEach(function (pass) {
      if (pass.cate_id.length < 1)
        pass.cate_id = '未分类'
      if (category.indexOf(pass.cate_id) < 0) {
        category.push(pass.cate_id)
      }
    })
    category.forEach(function (cate) {
      var _list = new Array;
      password.forEach(function (pass) {
        if (pass.cate_id == cate) {
          _list.push(pass)
        }
      })
      data.push({ 'title': cate, 'passes': _list })
    })
    this.data = data
  }
  getPassList() {
    return this.data;
  }
  addPassword(name, addr, uname, cateid) {
    var newData = {
      '_id': guid(), 'add_time': new Date(), 'address': addr, 'cate_id': cateid, 'father_id': '',
      'name': name, 'username': uname, 'password': randstr(default_settings.row * default_settings.column, default_settings.dict), 'settings': default_settings,
    }
    this.password.push(newData)
    this.decodeDatabase(this.password)
    wx.cloud.database().collection(col_pass).add({ data: newData })
  }
  updatePassword(_id, newPass) {
    for (var i = 0; i < this.password.length; i++) {
      if (this.password[i]._id == _id)
        this.password[i] = newPass
    }
    this.decodeDatabase(this.password)
    var _pass = null
    _pass = Object.assign({}, newPass)
    delete _pass['_id']
    delete _pass['_openid']
    wx.cloud.database().collection(col_pass).doc(_id).update({
      data: _pass
    })
  }
  deletePassword(_id) {
    for (var i = 0; i < this.password.length; i++) {
      if (this.password[i]._id == _id) {
        this.password.splice(i, 1)
      }
    }
    this.decodeDatabase(this.password)
    wx.cloud.database().collection(col_pass).doc(_id).remove({
      success: function (res) {
      }
    })
  }
  getPassByID(_id) {
    var r_pass = null
    this.data.forEach(function (ps) {
      ps.passes.forEach(function (pass) {
        if (pass._id == _id)
          r_pass = Object.assign({}, pass)
      })
    });
    return r_pass
  }
}
export { PassList }
exports.randstr = randstr
exports.default_settings = default_settings