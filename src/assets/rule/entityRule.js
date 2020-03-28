let telValidator = [{
  validator: (rule, value, callback) => {
    let typeName = "电话号码";
    if (value === '') {
      callback(new Error(`请输入${typeName}`));
    }
    let reg = /^1[3456789]\d{9}$/;
    if (!reg.test(value)) {
      callback(new Error(`${typeName}格式不正确`));
    }
    callback();
  },
  "trigger": "blur"
}];
export default {
  longitude: [{
    validator: (rule, value, callback) => {
      let typeName = "经度";
      if (value === '') {
        callback(new Error(`请输入${typeName}`));
      }
      let reg = /^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,4})?)|180(([.][0]{1,4})?))$/;
      if (!reg.test(value)) {
        callback(new Error(`${typeName}格式不正确`));
      }
      callback();
    },
    "trigger": "blur"
  }],
  latitude: [{
    validator: (rule, value, callback) => {
      let typeName = "纬度";
      if (value === '') {
        callback(new Error(`请输入${typeName}`));
      }
      let reg = /^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,4})?)|90(([.][0]{1,4})?))$/;
      if (!reg.test(value)) {
        callback(new Error(`${typeName}格式不正确`));
      }
      callback();
    },
    "trigger": "blur"
  }],
  reporterTel: telValidator,
  cxSurveyTel: telValidator,
  insuranceSurveyTel: telValidator,
}
