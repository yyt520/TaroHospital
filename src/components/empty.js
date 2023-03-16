import {Image, Text, View} from "@tarojs/components";
import React from "react";
import empty from '@assets/empty.png';
import './empty.scss'
const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={empty} className='empty-img'/>
        <Text className='empty-text'>暂无数据~~</Text>
      </View>
    </View>
  )
}
export default Empty
