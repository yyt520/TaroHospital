import React, {useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './index.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import forward from '@assets/home/forward.svg'
import {QRCode} from "taro-code";
import logo from '@assets/img.png';
import moment from 'moment'
const EpidemicSuccess = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [foregroundColor,setForegroundColor]=useState('#000000');
  const [backgroundColor,setBackgroundColor] = useState('#ffffff');

  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '流调结果'
    })
  }, [])
  useEffect(() => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const {data} = getCurrentInstance().router.params;
    setIsIphoneX(isIphoneX);
    if(data==0){
      setForegroundColor('#2CA568')
    }else {
      setForegroundColor('#FF3938');
    }
  }, [])
  const back = () => {
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }
  const onGoMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: 'wx178fc1457fc06085',
      success: function (res) {

      }
    })
  }
  const $onGoMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: 'wx8f446acf8c4a85f5',
      success: function (res) {
      }
    })
  }
  return (
    <View className='sign-success-box'>
        <View className='qrcode-view'>
          <Text className='time'>填写时间：{moment().format('YYYY-MM-DD HH:mm')}</Text>
          <View className='qrcode-wrap'>
            <QRCode
              text={'2222'}
              className='qrcode'
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              size={180}
              scale={4}
              errorCorrectLevel='L'
              typeNumber={10}
            />
            <Image src={logo} className='img'/>
          </View>
        </View>
        <View className='list-row' onClick={onGoMiniProgram} style='margin-top:10PX'>
          <View className='list-row-wrap'>
            <Text className='title'>河北健康码</Text>
            <Image src={forward} className='img'/>
          </View>
        </View>
        <View className='list-row' onClick={$onGoMiniProgram}>
          <View className='list-row-wrap'>
            <Text className='title'>国务院行程码</Text>
            <Image src={forward} className='img'/>
          </View>
        </View>
      <View className='footer' style={isIphoneX ? 'bottom:34rpx' : 'bottom:0rpx'}>
        <View className='btn-submit-view' onClick={back}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export default EpidemicSuccess;
