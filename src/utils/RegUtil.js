export function isMobile(mobile){
  let regExp = /^1(?:3[0-9]|4[5-9]|5[0-9]|6[12456]|7[0-8]|8[0-9]|9[0-9])[0-9]{8}$/
  if (!regExp.test(mobile)) {
    return false
  } else {
    return true
  }

}
export function isTel(tel){
  let regExp = /^0[1-9][0-9]{1,2}-[2-8][0-9]{6,7}$/;
  if(!regExp.test(tel)){
    return false;
  }
  return true;

}
export function  isChineseName(name){
  let reg = /^(?:[\u4e00-\u9fa5·]{2,16})$/;
  if(!reg.test(name)){
    return false;
  }
  return true;
}
// export function isIdCard(idCard){
//   let regExp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
//   if(!regExp.test(idCard)){
//     return false;
//   }
//   return true;
//
// }


/**
 * @method 身份证号码校验入口方法
 * @param {String} val 身份证号
 * @returns {Boolean}
 */
export  function isIdCard(val) {
  val += ''
  if (checkCode(val)) {
    let date = val.substring(6, 14)
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        return true
      }
    }
  }
  return false
}
/**
 * @method 校验码校验
 * @param {String} val 身份证号
 * @returns {Boolean}
 */
let checkCode = function (val) {
  let p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
  let code = val.substring(17)
  if (p.test(val)) {
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += val[i] * factor[i]
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true
    }
  }
  return false
}

/**
 * @method 出生日期校验
 * @param {String} val 身份证号
 * @returns {Boolean}
 */
let checkDate = function (val) {
  let pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/
  if (pattern.test(val)) {
    let year = val.substring(0, 4)
    let month = val.substring(4, 6)
    let date = val.substring(6, 8)
    let date2 = new Date(year + '-' + month + '-' + date)
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true
    }
  }
  return false
}
/**
 * @method 所在城市校验
 * @param {String} val 身份证号
 * @returns {Boolean}
 */
let checkProv = function (val) {
  let pattern = /^[1-9][0-9]/
  let provs = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门'
  }
  if (pattern.test(val)) {
    if (provs[val]) {
      return true
    }
  }
  return false
}
