import React, {Component, useEffect, useLayoutEffect, useState} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './audit-result.scss'
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import submitSuccess from '@assets/submit.png'
import {getCurrentInstance} from "@tarojs/runtime";
const AuditResult =()=>{
  const [isIphoneX,setIsIphoneX]=useState(false);
  const [item,setItem]=useState({});
  const lookup=()=>{
    Taro.redirectTo({
      url:'/pages/user/advance-order/advanceOrder',
    })
  }
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '审核'
    })
  }, [])
  useEffect(()=>{
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
  },[])
  return (
    <View className='audit-detail-box'>
      <View className='main'>
        <View  className='img-view'>
          <Image src={submitSuccess} className='img'/>
          <Text className='title'>提交成功</Text>
          <Text className='reason'>审核结果将发送至微信服务通知，请及时关注</Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX?'margin-bottom:34rpx':'margin-bottom:0rpx'} onClick={lookup}>
          <Text className='btn-submit-text'>查看预约</Text>
        </View>
      </View>
    </View>
  )
}
export  default AuditResult;
