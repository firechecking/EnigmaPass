class PassList {
  constructor(url, parameter) {
    this.data = [{ "title": "default", "passes": [{ "uuid": "1", "name": "baidu", "username": "zzz", "address": "www.baidu.com", "password": ",@Vj.ka$!YkKF8k41hak,.h;5D11;.1ls4f13d#f65lVV2kjs$hF5#488;!j7S4sF#D2ldS1KgKV!ssS$#g$.@9V7k.@h3@s!F,DDh49g34j@F0V7f!dl@@05;s#Dk13,6K5KaF#7l.,sflkD;alFDa", "settings": { "row": 15, "column": 10, "dict": "0123456789abcdefg" }, "time": "2021-07-03 18:27:56", "history": [] }] }];
  }
  getPassList() {
    return this.data;
  }
  getPassByUUID(uuid) {
    var r_pass = null
    this.data.forEach(function (ps) {
      ps.passes.forEach(function (pass) {
        if (pass.uuid == uuid)
          r_pass = pass
      })
    });
    return r_pass
  }
}
export { PassList }