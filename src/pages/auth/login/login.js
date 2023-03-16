import Taro from '@tarojs/taro';
import {Button, Image, Text, View} from '@tarojs/components';
import Icon from '@assets/icon.png'
import './login.scss';
import Api from '../../../config/api'
import React, {Component} from "react";
import {AtModal, AtModalAction} from "taro-ui";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
    }
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'登录'
    })
  }

  wxLogin = (e) => {
    if (e.detail.userInfo) {
      console.log(333, e);
      Taro.setStorageSync('userInfo', e.detail.userInfo)
      Taro.showModal({
        title: '温馨提示',
        showCancel:false,
        confirmColor:'#3299ff',
        content: '是否允许订阅电子发票开具提醒、预约成功通知、预约取消成功通知?',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            Taro.requestSubscribeMessage({
              tmplIds: Api.tmplIds,
              success: function (res) {
                Taro.reLaunch({
                  url: '/pages/index/index'
                })
              }, fail: function (res) {
                // Taro.redirectTo({
                //   url:'/pages/auth/login/login',
                // })
              }
            })
          }
        }
      })
    }
  }
  render() {
    return (
      <View className='container'>
        <View className='main'>
          <View className='login-box'>
            <Image src={Icon} className='hospital-img'/>
            <Text className='hospital'>廊坊市中医医院</Text>
          </View>
          <View className='wrap_line'>
            <View className='line'/>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='auth'>登录后开发者将获得以下权限</Text>
            </View>
          </View>
          <View className='_container'>
            <View className='wrap'>
              <Text className='info'>·获得你的公开信息（昵称、头像等）</Text>
            </View>
          </View>
          <Button type='primary' openType='getUserInfo' className='wx-login-btn'
                  onGetUserInfo={this.wxLogin}>确认登录</Button>
        </View>
      </View>
    );
  }
}

export default Login;
