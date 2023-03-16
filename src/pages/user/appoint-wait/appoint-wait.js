import React, {Component, useEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Button, Image, Text, View} from "@tarojs/components";
import './appoint-wait.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import Wait from '@assets/wait.svg'
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import {AtModal, AtModalAction} from "taro-ui";
import GIF from '../../../subPackages/assets/a.gif'
let timer = null;
export default  class AppointWait extends Component {
  constructor() {
    super();
    this.state = {
      visible: false,
      isIphoneX:false,
    }
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'预约中'
    })
  }

  componentDidMount() {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    this.setState({isIphoneX},()=>{
      this.skip();
    })
  }
  skip = async () => {
    const {id} = getCurrentInstance().router.params;
    if (timer == null) {
      timer = setInterval(async () => {
        console.log(333,id);
        try{
          const res = await fetchAppointSuccessQrCodeApi({appointId: id})
          console.log(777, res.data);
          if (res.code === 200) {
            const {
              state
            } = res.data;
            if (state == 1) {
              Taro.navigateTo({
                url: `/pages/user/payment-success/payment-success?id=${id}`
              })
              clearInterval(timer);
            } else if (state == 2) {
              Taro.showToast({
                icon: 'none',
                title: res.msg
              })
              // Taro.reLaunch({url: '/pages/index/index'})
              clearInterval(timer);
            }
          } else {
            clearInterval(timer);
            Taro.showToast({
              icon: 'none',
              title: res.msg
            })
          }
        }catch (e){
          conole.log(444,e.message);
        }

      }, 0)
    }

  }
  back = () => {
    Taro.showModal({
      title: '温馨提示',
      confirmColor:'#06B48D',
      showCancel:false,
      content: '返回首页不影响预约，请到【我的预约】中查看预约',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          Taro.reLaunch({
            url:'/pages/index/index'
          })
        }
      }
    })
  }

  render() {
    const {isIphoneX}=this.state;
    return <View className='appoint-wait-box'>
      <View className='main'>
        <Image src={GIF} className='wait-img'/>
        <Text className='title'>预约处理中</Text>
        <Text className='reason'>预计需要2~10秒钟...</Text>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={this.back}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>;
  }
}
