import Taro from '@tarojs/taro';
import {loginByWeXin, loginByWXApi} from '../services/auth';

/**
 * Promise封装Taro.checkSession
 */
function checkSession() {
  return new Promise(function(resolve, reject) {
    Taro.checkSession({
      success: function() {
        resolve(true);
      },
      fail: function() {
        reject(false);
      }
    })
  });
}

/**
 * Promise封装Taro.login
 */
function login() {
  return new Promise(function(resolve, reject) {
    Taro.login({
      success: function(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信登录
 */
export function loginByWeixin(payload) {

  return new Promise(function(resolve, reject) {
    return login().then((res) => {
      //登录远程服务器
      loginByWXApi({
        code: res.code,
        ...payload
      }).then(loginRes => {
         resolve(loginRes);
      }).catch(err => {
        reject(err);
      })

    }).catch((err) => {
      reject(err);
     })
  });
}

/**
 * 判断用户是否登录
 */
export function checkLogin() {
  return new Promise(function(resolve, reject) {
    if (Taro.getStorageSync('userInfo')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}
