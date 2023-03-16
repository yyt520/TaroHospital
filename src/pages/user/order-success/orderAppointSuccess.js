import Taro from '@tarojs/taro'
import {Image, Text, View} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react'
import './orderAppointSuccess.scss'
import {Barcode, QRCode} from 'taro-code'
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchAppointSuccessQrCodeApi} from "../../../services/combo";
import moment from 'moment';
import Forward from '@assets/home/forward.svg'

const OrderAppointSuccess = (props) => {
  const [comboName, setComboName] = useState('');
  const [date, setDate] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [patientId, setPatientId] = useState('');
  const [entourageHisId, setEntourageHisId] = useState('');
  const [name, setName] = useState('');
  const [entourageName, setEntourageName] = useState('');
  const [entourageIdCard, setEntourageIdCard] = useState('');
  const [entouragePhone, setEntouragePhone] = useState('');
  const [entourageRelation, setEntourageRelation] = useState('');
  const [timeType, setTimeType] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '预约成功'
    })
  }, [])
  useEffect(() => {
    let {item} = getCurrentInstance().router.params;
    const {comboName, date, orgName, phone, id, name} = JSON.parse(item);
    setName(name);
    _generateQrCode(id);

    // setComboName(comboName);
    // setPhone(phone);
    // setOrgName(orgName);
    // setQrCode(qrcode);
    // setDate(moment(date).format('YYYY-MM-DD'));
    // setQrCode(qrcode);
    // comboName: "核酸检测"
    // date: 1609862400000
    // orgName: "北京市红十字会急诊抢救中心"
    // phone: "18311410379"
    // qrcode: "/home/hmp/images/qrcode/265965661749116928.jpg"
  }, [])
  const _generateQrCode = async (id) => {
    const res = await fetchAppointSuccessQrCodeApi({appointId: id})
    console.log(333, res);
    if (res.code === 200) {
      const {
        comboName,
        date,
        entourageHisId,
        entourageName,
        entourageIdCard,
        entouragePhone,
        entourageRelation,
        orgName,
        timeType,
        patientId,
        phone
      } = res.data;

      setComboName(comboName);
      setDate(date);
      setOrgName(orgName);
      setPhone(phone);
      setTimeType(timeType);
      setPatientId(patientId);
      entouragePhone && setEntouragePhone(entouragePhone);
      entourageHisId && setEntourageHisId(entourageHisId);
      entourageIdCard && setEntourageIdCard(entourageIdCard)
      entourageName && setEntourageName(entourageName);
      entourageRelation && setEntourageRelation(entourageRelation);
      // comboName: "核酸检测"
      // date: 1610640000000
      // orgName: "北京市红十字会急诊抢救中心"
    }
  }
  const entouragePage = () => {
    let item = {
      entourageHisId,
      entourageName,
      entourageIdCard,
      entouragePhone,
      entourageRelation,
      orgName,
      comboName,
    }
    Taro.navigateTo({
      url: `/pages/user/entourage-success/entourage-success?item=${JSON.stringify(item)}`
    })
  }
  const _getWeek = (date) => {
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
        <View className='tsm-view'>
          <View className='qrcode-view'>
            <Barcode text={patientId} width={283} height={96} scale={4}/>
            <View className='barcode-text'>
              <Text className='qrcode-str'>{patientId}</Text>
            </View>
            <View className='qrcode'>
              <QRCode
                text={patientId}
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
        {entourageHisId && <View className='info-confirm-wrap' onClick={entouragePage}>
          <Text className='label'>陪同人</Text>
          <View className='list-row-wrap'>
            <Text className='value' style={'color:#3299ff'}>{entourageName}</Text>
            <Image src={Forward} className='forward'/>
          </View>
        </View>}
        <View className='info-confirm-wrap'>
          <Text className='label'>预约时间</Text>
          <Text
            className='value'>{moment(date).format('YYYY-MM-DD')} {_getWeek(date)} {timeType == 0 ? '上午' : timeType == 1 ? '下午' : '全天'}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>姓名</Text>
          <Text className='value'>{name}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>手机号</Text>
          <Text className='value'>{phone}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约医院</Text>
          <Text className='value'>{orgName}</Text>
        </View>
        <View className='info-confirm-wrap'>
          <Text className='label'>预约套餐</Text>
          <Text className='value'>{comboName}</Text>
        </View>
      </View>
    </View>
  )
}
export default OrderAppointSuccess
