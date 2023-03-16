import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import './entourage-success.scss'
import {Barcode, QRCode} from 'taro-code'
import {getCurrentInstance} from "@tarojs/runtime";
import Taro from "@tarojs/taro";
const EntourageSuccess = (props) => {
  const [isIphoneX,setIsIphoneX]=useState(false);
  const [item,setItem] =useState({});
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '预约成功'
    })
  }, [])
  useEffect(() => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    let {item} = getCurrentInstance().router.params;
    setItem(JSON.parse(item));
    setIsIphoneX(isIphoneX);
    // qrcode: "/home/hmp/images/qrcode/265965661749116928.jpg"
  }, [])
  const skip = () => {
    Taro.reLaunch({ url: '/pages/index/index' })
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='tsm-view'>
          <View className='qrcode-view'>
            <Barcode text={item.entourageHisId} width={283} height={96} scale={4}/>
            <View className='barcode-text'>
              <Text className='qrcode-str'>{item.entourageHisId}</Text>
            </View>
            <View className='qrcode'>
              <QRCode
                text={item.entourageHisId}
                size={122}
                scale={4}
                errorCorrectLevel='M'
                typeNumber={2}
              />
            </View>
            <Text className='order-status'>预约成功</Text>
            {/*<Text className='desc'>若【取消预约】请前往【我的预约】内进行取消</Text>*/}
          </View>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>陪同人姓名</Text>
          <Text className='value' >{item.entourageName}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>手机号</Text>
          <Text className='value'>{item.entouragePhone}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>与陪同人关系</Text>
          <Text className='value'>{item.entourageRelation}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约医院</Text>
          <Text className='value'>{item.orgName}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约套餐</Text>
          <Text className='value'>{item.comboName}</Text>
        </View>
      </View>
      <View className='footer' >
        <View className='btn-submit-view' style={isIphoneX?'margin-bottom:34rpx':'margin-bottom:0rpx'} onClick={skip}>
          <Text className='btn-submit-text'>返回首页</Text>
        </View>
      </View>
    </View>
  )
}
export default EntourageSuccess
