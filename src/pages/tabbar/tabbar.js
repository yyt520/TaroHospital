import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import VirtualList from '@tarojs/components/virtual-list'
import {AtTabBar} from "taro-ui";
import {useState} from "react";
const Tabbar =()=>{
  const [current,setCurrent] =useState(0);
  const handleClick=(value)=> {
    this.setState({
      current: value
    })
  }
  return(
    <AtTabBar
      fixed
      tabList={[
        { title: '待办事项', text: 8 },
        { title: '拍照' },
        { title: '通讯录', dot: true }
      ]}
      onClick={handleClick}
      current={0}
    />
  )
}
