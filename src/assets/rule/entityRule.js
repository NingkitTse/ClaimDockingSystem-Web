export let telValidator = [{
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
export let lngValidator = (rule, value, callback) => {
  let typeName = "经度";
  if (value === '') {
    callback(new Error(`请输入${typeName}`));
  }
  let intVal = parseInt(value);
  if (intVal < -180 || intVal > 180) {
    callback(new Error('经度必须在-180~180之间'));
  }
  callback();
}
export let latValidator = (rule, value, callback) => {
    let typeName = "纬度";
    if (value === '') {
      callback(new Error(`请输入${typeName}`));
    }
    let intVal = parseInt(value);
    if (intVal < -90 || intVal > 90) {
      callback(new Error('纬度必须在-90~90之间'));
    }
    callback();
}

export let radiusValidator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入搜索半径'));
  } 
  let intVal = parseInt(value);
  if (intVal < 1 || intVal > 500) {
    callback(new Error('半径必须在1~500km之间'));
  }
  callback();
};
export default {
  longitude: [{validator: lngValidator, trigger: "blur"}],
  latitude: [{validator: latValidator, trigger: "blur"}],
  reporterTel: telValidator,
  cxSurveyTel: telValidator,
  insuranceSurveyTel: telValidator,
}
