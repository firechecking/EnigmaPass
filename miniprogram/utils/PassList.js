class PassList {
  constructor(url, parameter) {
    this.data = [
      { title: 'default', passes: [{ 'uuid': '1', 'name': 'baidu' }, { 'uuid': '2', 'name': 'alibaba' }] },
      { title: '邮箱', passes: [{ 'uuid': '3', 'name': 'tencent' }, { 'uuid': '5', 'name': 'pdd' }] }
    ];
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