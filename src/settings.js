let url = ''
let webSocketUrl = ''
console.info(process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'mock':
    url = `${process.env.VUE_APP_BASE_WEB_URL}:${process.env.VUE_APP_BASE_WEB_PORT}`
    break
  case 'production': // 电力系统内网IP
    url = 'http://10.233.48.50:8328/power'
    webSocketUrl = 'ws://10.233.48.50:8328/power/imserver'
    break
  case 'staging': // 测试云环境
    url = 'http://218.244.150.51:8328/power'
    webSocketUrl = 'ws://218.244.150.51:8328/power/imserver'
    break
  case 'development':
    url = 'http://127.0.0.1:8080/power'
    webSocketUrl = 'ws://127.0.0.1:8080/power/imserver'
    break
}

module.exports = {

  title: '电网大数据快速对接保险理赔系统',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false,

  backEndBaseUrl: url,

  webSocketUrl: webSocketUrl
}
