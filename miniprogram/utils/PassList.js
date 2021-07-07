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
function dateFormat(date, fmt) {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "H+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

class PassList {
  constructor(url, parameter) {
    this.db = wx.cloud.database()
    this.father_dict = {}
    this.password = [{ "_id": "1", "name": "QQ", "username": "164049406", "address": "mail.qq.com", "cate_id": "邮箱", "father_id": "", "password": ",@Vj.ka$!YkKF8k41hak,.h;5D11;.1ls4f13d#f65lVV2kjs$hF5#488;!j7S4sF#D2ldS1KgKV!ssS$#g$.@9V7k.@h3@s!F,DDh49g34j@F0V7f!dl@@05;s#Dk13,6K5KaF#7l.,sflkD;alFDa", "settings": { "row": 15, "column": 10, "dict": "0123456789fghjkmnpqrtuvwxyzDEFGMNPQRSTUVW~!@#$%^&*()_+{};<>,." }, "add_time": new Date("2021-07-03 18:27:56") }]
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
  fixPassword(pass) {
    var temp_id = pass['_id']
    if (pass.father_id.length < 1) {
      pass.father_id = guid()
      delete pass['_openid']
      delete pass['_id']
      wx.cloud.database().collection(col_pass).doc(temp_id).update({
        data: pass
      })
      pass['_id'] = temp_id
    }
    return pass
  }
  decodeDatabase(password) {
    var category_ids = []
    var data = new Array
    var that = this
    this.father_dict = {}
    // collect all category_ids and father_dict
    password.forEach(function (pass) {
      pass = that.fixPassword(pass)
      if (pass.cate_id.length < 1)
        pass.cate_id = '未分类'
      if (category_ids.indexOf(pass.cate_id) < 0) {
        category_ids.push(pass.cate_id)
      }
      if (!that.father_dict.hasOwnProperty(pass.father_id))
        that.father_dict[pass.father_id] = []
      that.father_dict[pass.father_id].push(pass)
    })
    // collect father_ids for each category_id
    category_ids.forEach(function (category_id) {
      var _list = []
      var _father_ids = []
      password.forEach(function (pass) {
        if (pass.cate_id == category_id) {
          if (_father_ids.indexOf(pass.father_id) < 0)
            _father_ids.push(pass.father_id)
        }
      })
      // choose recent password in each father_id
      _father_ids.forEach(function (_id) {
        _list.push(that.getPassbyFatherId(_id, false))
      })
      data.push({ 'title': category_id, 'passes': _list })
    })
    // data = data.sort(function (a, b) { return a.title < b.title })
    this.data = data
    console.log(this.data)
  }
  getPassbyFatherId(father_id, isAll) {
    var passes = this.father_dict[father_id]
    var newPasses = passes.sort(function (a, b) { return b.add_time - a.add_time })
    if (isAll) return newPasses
    else return Object.assign({}, newPasses[0])
  }
  getPassList() {
    return this.data;
  }
  addPassword(name, addr, uname, cateid) {
    var newData = {
      '_id': guid(), 'add_time': new Date(), 'address': addr, 'cate_id': cateid, 'father_id': guid(),
      'name': name, 'username': uname, 'password': randstr(default_settings.row * default_settings.column, default_settings.dict), 'settings': default_settings,
    }
    this.password.push(newData)
    this.decodeDatabase(this.password)
    wx.cloud.database().collection(col_pass).add({ data: newData })
  }
  addPasswordObj(newData) {
    this.password.push(newData)
    this.decodeDatabase(this.password)
    delete newData['_openid']
    wx.cloud.database().collection(col_pass).add({ data: newData })
  }
  updatePassword(_id, newPass) {
    for (var i = 0; i < this.password.length; i++) {
      if (this.password[i]._id == _id) {
        this.password[i] = newPass
        this.password[i]._id = _id
      }
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
  deletePasswordByFatherId(_father_id) {
    var to_remove_ids = []
    for (var i = this.password.length - 1; i >= 0; i--) {
      if (this.password[i].father_id == _father_id) {
        to_remove_ids.push(this.password[i]._id)
        this.password.splice(i, 1)
      }
    }
    this.decodeDatabase(this.password)
    to_remove_ids.forEach(function (_id) {
      wx.cloud.database().collection(col_pass).doc(_id).remove()
    })

  }
  getPassByID(_id) {
    var r_pass = null
    this.password.forEach(function (pass) {
      if (pass._id == _id)
        r_pass = Object.assign({}, pass)
    })
    return r_pass
  }
}
export { PassList }
exports.guid = guid
exports.randstr = randstr
exports.default_settings = default_settings
exports.dateFormat = dateFormat