import Taro from '@tarojs/taro'
import {Image, Input, Picker, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react';
import './index.scss'
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import AddressPicker from "../../../components/addressPicker";
import Forward from '@assets/home/forward.svg'
import {
  callDepartmentListApi,
  callGetEmployeeInfoApi,
  callInsertEmployeeInfoApi,
  callUpdateEmployeeInfoApi
} from "../../../services/home";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";

const cityRange = require('../../../components/data/region.json');
const InsertEmployeeInfo = () => {
  const [openSetting, setOpenSetting] = useState(false);
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  // payType	支付方式 0 线上支付 1 线下支付
  const [payType, setPayType] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [deptId, setDeptId] = useState('');
  const [departmentRange, setDepartmentRange] = useState([])
  const [area, setArea] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [multiArray, setMultiArray] = useState([]);
  const [picker_key, setPickerKey] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState({});
  const [patientId,setPatientId] = useState('');
  const [ctstamp,setCtstamp] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '员工信息采集与更新'
    })
  }, [])
  useEffect(() => {
    _initData();
    getEmployeeInfo();
    getPickerCity([0, 0, 0]);
  }, [])
  const getEmployeeInfo = async () => {
    const _res = await user.loginByWeixin({appid: Config.appid});
    console.log(123456, _res);
    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;
      const result = await callGetEmployeeInfoApi(userId);
      if (result.data) {
        setEmployeeInfo(result.data);
        const {
          addrHome,
          provinceid,
          cityid,
          ctstamp,
          districtid,
          department,
          departName,
          name,
          idCard,
          phone,
          patientId,
          streetdesc
        } = result.data;
        setName(name);
        setPhone(phone);
        setDeptId(department);
        setProvinceId(provinceid);
        setCityId(cityid);
        setDistrictId(districtid);
        setIdCard(idCard);
        setArea(addrHome.substring(0, addrHome.indexOf(streetdesc)));
        setStreetDesc(streetdesc);
        setDepartmentName(departName);
        setPatientId(patientId);
        setCtstamp(ctstamp);
        console.log(333,result.data)
      } else {
        setEmployeeInfo({});
      }
    }
  }
  const _initData = async () => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    const userInfo = Taro.getStorageSync('userInfo');
    console.log(333, userInfo);
    const res = await callDepartmentListApi();
    console.log(999, res);
    if (res.code === 200) {
      setDepartmentRange(res.data);
    }
  }
  const getPickerCity = (key) => {

    let province = [];//省
    let city = [];//市
    let county = [];//区

    //省
    cityRange.forEach(provinces => {
      province.push(provinces['text'])
    });

    //市
    if (cityRange[key[0]]['children'] && cityRange[key[0]]['children'].length > 0) {
      cityRange[key[0]]['children'].forEach(citys => {
        city.push(citys['text'])
      })
    }
    //区县
    cityRange[key[0]]['children'][key[1]]['children'].forEach(countys => {
      county.push(countys['text'])
    });
    let alls = [];
    alls.push(province)
    alls.push(city)
    alls.push(county)
    setMultiArray(alls);
    setPickerKey(key);
  }

  const nextStep = async () => {
    if (isEmpty(name)) {
      Taro.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (isEmpty(phone)) {
      Taro.showToast({
        title: '手机号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isMobile(phone)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(idCard)) {
      Taro.showToast({
        title: '身份证号不能为空',
        icon: 'none',
      })
      return;
    }
    if (!isIdCard(idCard)) {
      Taro.showToast({
        title: '身份证号格式不正确',
        icon: 'none',
      })
      return;
    }
    if (Object.keys(employeeInfo).length == 0) {
      if (isEmpty(authCode)) {
        Taro.showToast({
          title: '授权密码码不能为空',
          icon: 'none',
        })
        return;
      }
      if (authCode !== 'LFZYYYGXXCJ20210813') {
        Taro.showToast({
          title: '授权密码不正确',
          icon: 'none',
        })
        return;
      }
    }
    if (isEmpty(departmentName)) {
      Taro.showToast({
        title: '请选择员工部门',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(provinceid) && isEmpty(cityid) && isEmpty(districtid)) {
      Taro.showToast({
        title: '请选择家庭住址',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(streetdesc)) {
      Taro.showToast({
        title: '详细地址不能为空',
        icon: 'none',
      })
      return;
    }
    Taro.showLoading({
      title:Object.keys(employeeInfo).length==0?'正在采集请稍等...':'正在更新请稍等...'
    })
    const _res = await user.loginByWeixin({appid: Config.appid});
    console.log(123456, _res);
    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;
      if (Object.keys(employeeInfo).length == 0) {
        const res = await callInsertEmployeeInfoApi({
          authCode,
          department: deptId,
          id: userId,
          idCard,
          name,
          phone,
          provinceid,
          cityid,
          districtid,
          streetdesc,
          addrHome: '',
        })
        if (res.code == 200) {
          Taro.showToast({
            title: '采集完成',
            icon: 'none',
          })
          Taro.navigateBack({
            delta: 1
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        Taro.hideLoading();
      } else {
        const res = await callUpdateEmployeeInfoApi({
          department: deptId,
          id: userId,
          idCard,
          ctstamp,
          patientId,
          useflag:1,
          name,
          phone,
          provinceid,
          cityid,
          districtid,
          streetdesc,
          addrHome:area+streetdesc,
        })
        if (res.code == 200) {
          Taro.showToast({
            title: '更新完成',
            icon: 'none',
          })
          Taro.navigateBack({
            delta: 1
          })
        } else {
          Taro.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
        Taro.hideLoading();
      }
    }

  }
  const toggleAddressPicker = (areaInfo, coding) => {
    const _coding = coding.split(',');
    console.log(333, areaInfo, coding);
    setArea(areaInfo);
    setProvinceId(_coding[0]);
    setCityId(_coding[1]);
    setDistrictId(_coding[2]);
    setShowPicker(false);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  const _selectEmployeeDept = (e) => {
    setDepartmentName(departmentRange[e.detail.value].v_name);
    setDeptId(departmentRange[e.detail.value].value_id);
  }
  const cityColumnChangePicker = (e) => {
    let {column, value} = e.detail
    switch (column) {
      case 0:
        getPickerCity([value, 0, 0])
        break;
      case 1:
        getPickerCity([picker_key[0], value, 0])
        break;
      case 2:
        getPickerCity([picker_key[0], picker_key[1], value])
        break;
      default:
        break;
    }
  }
  const cityChangePicker = (e) => {
    let value = e.detail.value;
    if (cityRange.length > 0) {
      let province = cityRange[value[0]];
      let city = cityRange[value[0]].children[value[1]];
      let district = cityRange[value[0]].children[value[1]].children[value[2]];
      setArea(province.text + " " + city.text + " " + district.text);
      setProvinceId(province.value);
      setCityId(city.value);
      setDistrictId(district.value);
      console.log(2222, province.value, city.value, district.value);
      // let id = cityRange[value[0]].children[value[1]].children[value[2]].value
    }
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className="self-info-view">
          <Text className='self-info-text'>就诊信息</Text>
        </View>
        <ListRow value={name} className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='姓名' placeholder='请输入姓名'/>
        <ListRow value={phone} className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='电话' placeholder='请输入电话号码'/>
        {/*<View className='list-row-container'>*/}
        {/*  <View className='list-row-wrap'>*/}
        {/*    <View className='list-row-view  flex-between'>*/}
        {/*      <Text className='list-row-text' style='margin-right:60rpx'>验证码</Text>*/}
        {/*      <Input type='text' className='__list-row-input' onInput={(e) => {*/}
        {/*        setVerifyCode(e.detail.value);*/}
        {/*      }} placeholder={'请输入图片验证码'}*/}
        {/*             placeholderClass='list-row-input-placeholder'/>*/}
        {/*      <View className='code-view' onClick={getImageCode}>*/}
        {/*        <Image src={imgCode} className='img-code'/>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*  <View className='line'/>*/}
        {/*</View>*/}
        <ListRow value={idCard} className='_list-row-input' type='idcard' onInput={(e) => {
          setIdCard(e.detail.value);
        }} label='身份证号' placeholder='请输入身份证号'/>
        {Object.keys(employeeInfo).length == 0 ? <ListRow className='_list-row-input' type='text' onInput={(e) => {
          setAuthCode(e.detail.value);
        }} label='授权密码' value={authCode} placeholder='请输入授权密码'/> : null}
        {/*<Picker mode='selector' rangeKey='v_name' range={jobCaseRange} onChange={_selectJobCase}>*/}
        {/*  <View className='address-info-container'>*/}
        {/*    <View className='address-info-wrap'>*/}
        {/*      <View className='address-info-view'>*/}
        {/*        <View style='display:flex;alignItems:center'>*/}
        {/*          <Text className='dist-name-text'>从业状况</Text>*/}
        {/*          <Text className='select-city-text _list-row-input'*/}
        {/*                style={jobCase === '' ? 'color:#999' : 'color:#666'}>{isEmpty(jobCase)?'请选择从业状况':jobCase}</Text>*/}
        {/*        </View>*/}
        {/*        <Image src={Forward} className='forward'/>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*    <View className='line'/>*/}
        {/*  </View>*/}
        {/*</Picker>*/}
        <Picker mode='selector' rangeKey='v_name' range={departmentRange} onChange={_selectEmployeeDept}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text'>员工部门</Text>
                  <Text className='select-city-text _list-row-input'
                        style={departmentName === '' ? 'color:#999' : 'color:#666'}>{isEmpty(departmentName) ? '请选择部门' : departmentName}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        <Picker value={picker_key} mode="multiSelector" onChange={cityChangePicker}
                onColumnchange={cityColumnChangePicker} range={multiArray}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text'>家庭住址</Text>
                  <Text className='select-city-text _list-row-input'
                        style={area === '' ? 'color:#999' : 'color:#666'}>{isEmpty(area) ? '请选择家庭住址' : area}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        <View className='detail-address-container'>
          <View className='detail-address-textarea'>
            <Textarea onInput={e => {
              setStreetDesc(e.detail.value)
            }} value={streetdesc} className='textarea-text' placeholder='街道、楼牌号等'
                      placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>
      </View>

      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={nextStep}>
          <Text className='btn-submit-text'>提交</Text>
        </View>
      </View>
      <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>

    </View>
  )
}
const ListRow = (props) => {
  const {label, placeholder, value, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text'>{label}</Text>
          <Input type={type} value={value} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'
          />
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}

export default InsertEmployeeInfo
