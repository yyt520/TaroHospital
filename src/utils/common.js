// /**
//  * 节流
//  * @param action
//  * @param delay
//  * @returns {Function}
//  */
import Taro from '@tarojs/taro'
import Api from '../config/api';
export function throttle(fun, delay) {
  let last, deferTimer
  return function (args) {
    let that = this
    let _args = arguments
    let now = +new Date()
    if (last && now < last + delay) {
      clearTimeout(deferTimer)
      deferTimer = setTimeout(function () {
        last = now
        fun.apply(that, _args)
      }, delay)
    } else {
      last = now
      fun.apply(that, _args)
    }
  }
}


/**
 * 防抖
 */
export function debounce(fn, delay = 300) {
  let timer = null;
  return function (...rest) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, rest);
      timer = null;
    }, delay);
  }
}

export function desensitizationMobile(str) {
  if (null != str && str != undefined) {
    var pat = /(\d{3})\d*(\d{4})/;
    return str.replace(pat, '$1****$2');
  } else {
    return "";
  }
}

export function desensitizationIdCard(str) {
  if (null != str && str != undefined) {
    var pat = /(\w{2})\w*(\w{2})/;
    return str.replace(pat, '$1**************$2');
  } else {
    return "";
  }
}

export const Utils = {
  trim: function (value) {
    //去空格
    return value.replace(/(^\s*)|(\s*$)/g, "");
  },
  isFloat: function (value) {
    //金额，只允许保留两位小数
    return /^([0-9]*[.]?[0-9])[0-9]{0,1}$/.test(value);
  },
  isNum: function (value) {
    //是否全为数字
    return /^[0-9]+$/.test(value);
  },
  formatNum: function (num) {
    //格式化手机号码
    if (utils.isMobile(num)) {
      num = num.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
    }
    return num;
  },
  toast: function (text, duration, success) {
    wx.showToast({
      title: text,
      icon: success ? 'success' : 'none',
      duration: duration || 2000
    })
  },
  preventMultiple: function (fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
      gapTime = 200;
    }
    let lastTime = null;
    return function () {
      let now = +new Date();
      if (!lastTime || now - lastTime > gapTime) {
        fn.apply(this, arguments);
        lastTime = now;
      }
    }
  },
  request: function (url, postData, method, type, hideLoading) {
    let that = this;
    //接口请求
    if (!hideLoading) {
      Taro.showLoading({
        title: '请稍候...',
        mask: true
      })
    }
    // let user = Taro.getStorageSync('user');
    // let tokenData = Taro.getStorageSync('tokenData');
    // if(tokenData && tokenData.loginTime) {
    //   let currentTime = new Date().getTime();
    //   let deltaTime = currentTime - tokenData.loginTime;
    //   if (deltaTime <= tokenData.expiresIn * 1000) {
    //     if (user && user.userId) {
    //       // this.setUser(user);
    //       // this.setTokenReady(true);
    //       Taro.setStorageSync('user',user);
    //     }
    //   } else {
    //     // // #ifdef H5
    //     // let code = this.UTIL.getUrlParam("code");
    //     // if(code) return ;
    //     // // #endif
    //     console.log(444,'走了');
    //
    //       // that.tokenRefresh(tokenData.refreshToken);
    //     Taro.request({
    //       url: Api.USER_REFRESH_TOKEN,
    //       method: "POST",
    //       data: {refreshToken:tokenData.refreshToken},
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded'
    //       },
    //       success: result => {
    //         const {code, data} = result.data;
    //         if (code == 20000) {
    //           let loginTime = new Date().getTime();
    //           Taro.setStorageSync("token", data.token);
    //           data.loginTime = loginTime;
    //           // data.lastRefreshTime = loginTime;
    //           Taro.setStorageSync("tokenData", data);
    //           // this.getUserInfo();
    //           // alert("重新连接");
    //         } else if (code == 50000) {
    //           const  openId = Taro.getStorageSync('openId');
    //         //   Taro.showToast({
    //         //     title: result.data.message,
    //         //     icon: 'none',
    //         //     duration: 3500,
    //         //   })
    //         //   let timer = setTimeout(() => {
    //         //     Taro.redirectTo({
    //         //       url: '/pages/auth/index'
    //         //     })
    //         //     clearTimeout(timer);
    //         //   }, 1000)
    //
    //           callMiniTokenApi({
    //             wechatKey:openId,
    //             loginType:process.env.TARO_ENV==='weapp'?1:2,
    //           }).then($res=>{
    //             console.log(444, $res);
    //             if ($res.code == 20000) {
    //               let loginTime = new Date().getTime();
    //               Taro.setStorageSync("token", $res.data.token);
    //               $res.data.loginTime = loginTime;
    //               Taro.setStorageSync("tokenData", $res.data);
    //               that.getUserInfo();
    //             }
    //           })
    //
    //         }
    //       }
    //     })
    //   }
    // }
    return new Promise((resolve, reject) => {
      Taro.request({
        url,
        data: postData,
        header: {
          'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
          'x-token': Taro.getStorageSync('token')
        },
        method: method, //'GET','POST'
        dataType: 'json',
        success: (res) => {
          !hideLoading && Taro.hideLoading()
          if (res.data.code == 50014) {
            Taro.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3500,
            })
          } else {
            resolve(res.data);
          }
        },
        fail: (res) => {
          !hideLoading && this.toast("网络不给力，请稍后再试~")
          //wx.hideLoading()
          reject(res)
        }
      })
    })
  },
  uploadFile: function (src) {
    const that = this
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: 'http://39.108.124.252:8081/fileServce/file/ ', //测试地址,暂不使用
        filePath: src,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {},
        success: function (res) {
          wx.hideLoading()
          let d = JSON.parse(res.data)
          if (d.code === 1) {
            let fileObj = JSON.parse(d.data)[0];
            //文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
            resolve(fileObj)
          } else {
            that.toast(res.message);
          }
        },
        fail: function (res) {
          reject(res)
          wx.hideLoading();
          that.toast(res.message);
        }
      })
    })
  }
}
