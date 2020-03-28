let url = '';
console.info(process.env.NODE_ENV)
switch (process.env.NODE_ENV) {
  case 'mock': 
    url = `${process.env.VUE_APP_BASE_WEB_URL}:${process.env.VUE_APP_BASE_WEB_PORT}`
    break;
  case 'production':
    url = "http://127.0.0.1:8080/power";
    break;
  case 'staging':
    url = "http://115.157.192.61:8328/power"
    break;
  case 'development':
    url = "http://127.0.0.1:8080/power";
    break;
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
}
