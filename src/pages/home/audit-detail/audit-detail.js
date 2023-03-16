import React, {useEffect, useLayoutEffect, useState} from 'react'
import {Image, Text, View} from "@tarojs/components";
import './audit-detail.scss'
import AuditIn from '@assets/audit-in.svg'
import AuditSuccess from '@assets/audit-success.svg';
import AuditRefund from '@assets/audit-refund.png'
import {getCurrentInstance} from "@tarojs/runtime";
import Taro from "@tarojs/taro";
const AuditDetail =()=>{
  const [item,setItem]=useState({});
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '审核详情'
    })
  }, [])
  useEffect(()=>{
     const {item}=getCurrentInstance().router.params;
     setItem(JSON.parse(item))
  },[])
  return (
     <View className='audit-detail-box'>
        <View className='main'>
            <View  className='img-view'>
              <Image src={item.state==0?AuditIn:item.state==1?AuditSuccess:AuditRefund} className='img'/>
              <Text className='title'>{item.state ==0?'审核中':item.state==1?'已通过':'已驳回'}</Text>
              {item.state ==2&&<Text className='reason'>驳回原因：{item.refuseReason}</Text>}
              {item.state==0&&<Text className='reason'>审核结果将发送至微信服务通知，请及时关注</Text>}
              {item.state ==1&&<Text className={'reason'}>请在我的预约中查看已预约订单</Text> }
            </View>
        </View>
     </View>
  )
}
export  default AuditDetail;
