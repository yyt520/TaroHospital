import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import './detail.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import moment from 'moment';
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import Taro from "@tarojs/taro";
const Detail = (props) => {
  const [item,setItem]=useState({});
  const [orgName,setOrgName]=useState('');
  const [result,setResult] =useState('');
  const [resultTime,setResultTime] =useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '检验结果详情'
    })
  }, [])
  useEffect(()=>{
    let {item,result,resultTime} = getCurrentInstance().router.params;
    setItem(JSON.parse(item))
    setResult(result);
    setResultTime(resultTime);
    _getOrgName(JSON.parse(item).id);
  },[])
  const _getOrgName=async (id)=> {
    const res = await fetchAppointSuccessQrCodeApi({appointId: id})
    if (res.code === 200) {
      const {orgName} = res.data;
      setOrgName(orgName);
    }
  }
 const  _getWeek = (date) => {
    let week = moment(date).day()
    switch (week) {
      case 0:
        return '周日';
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六'
    }
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='result-view'>
          <Text className='result-text'>nCoV-RNA核酸检测结果</Text>
        </View>
        <View className='status-view'>
          <Text className='status-text'>{result}</Text>
        </View>
        <View className='list-row-view'>
          <Text className='label'>检测人姓名</Text>
          <Text className='value'>{item.name}</Text>
        </View>
        <View className='list-row-view '>
          <Text className='label'>检测人医院</Text>
          <Text className='value'>{orgName}</Text>
        </View>
        <View className='list-row-view'>
        <Text className='label'>检测日期</Text>
        <Text className='value'>{resultTime}</Text>
      </View>

      </View>
    </View>
  )
}
export default Detail
