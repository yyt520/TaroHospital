import Taro from '@tarojs/taro';

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "GET") {
  return new Promise(function(resolve, reject) {
    Taro.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
          // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      success: function(res) {
        if (res.statusCode == 200) {

          if (res.data.errno == 501) {
            // 清除登录相关内容
            try {
              Taro.removeStorageSync('userInfo');
              Taro.removeStorageSync('token');
            } catch (e) {
              // Do something when catch error
            }
            // 切换到登录页面
            Taro.navigateTo({
              url: '/pages/auth/login/login'
            });
          } else if(res.data.errno == 0) {
            resolve(res.data.data);
          } else {
            // Taro.showModal({
            //   title: '错误信息',
            //   content: res.data.errmsg,
            //   showCancel: false
            // });
            resolve(res.data);
            // console.log(444,res.data);
          }
        } else {
          reject(res.errMsg);
        }

      },
      fail: function(err) {
        reject(err)
      }
    })
  });
}

request.get = (url, data) => {
  return request(url, data, 'GET');
}

request.post = (url, data) => {
  return request(url, data, 'POST');
}
request.put = (url,data)=>{
  return request(url,data,'PUT');
}

export default request;
