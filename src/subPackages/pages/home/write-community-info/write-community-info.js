import Taro from '@tarojs/taro'
import {Button, Image, Input, Picker, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react';
import './write-community-info.scss'
import {isEmpty} from "../../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../../utils/RegUtil";
import AddressPicker from "../../../../components/addressPicker";
import Api from "../../../../config/api";
import {AtModal, AtModalAction} from "taro-ui";
import Forward from '@assets/home/forward.svg'
import {getJobCaseDicApi, getPatientTypeApi} from "../../../../services/home";
import {getComboInfoByComboIdApi, getCommunityInfoApi} from '../../../../services/combo'
import Scanner from '@assets/home/scanner.png'
import moment from "moment";

const cityRange = require('../../../../components/data/region.json');
const WriteCommunityInfo = () => {
  const [comboList, setComboList] = useState('');
  const [visible, setVisible] = useState(true);
  const [openSetting, setOpenSetting] = useState(false);
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [imgCode, setImgCode] = useState('');
  const [orgName, setOrgName] = useState('');
  const [userType, setUserType] = useState(2);
  const [price, setPrice] = useState(0);
  const [comboName, setComboName] = useState('');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [sourceId, setSourceId] = useState('');
  const [comboId, setComboId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [provinceid, setProvinceId] = useState('');
  const [cityid, setCityId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [code, setCode] = useState('');
  // payType	支付方式 0 线上支付 1 线下支付
  const [payType, setPayType] = useState(0);
  const [showPicker, setShowPicker] = useState(false);
  const [patientType, setPatientType] = useState('社会群体');
  const [patientId, setPatientId] = useState('1');
  const [patientTypeRange, setPatientRange] = useState([])
  const [jobCase, setJobCase] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobCaseRange, setJobRange] = useState([])
  const [area, setArea] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [timeType, setTimeType] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [communityFlag, setCommunityFlag] = useState('1');
  const [multiArray, setMultiArray] = useState([]);
  const [picker_key, setPickerKey] = useState([]);
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '填写就诊人信息'
    })
  }, [])
  useEffect(() => {
    _initData();
    getPickerCity([0,0,0])
    getImageCode();
    getComboList();
  }, [])
  const _initData = async () => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    const res = await Promise.all([getJobCaseDicApi(), getPatientTypeApi()]);
    console.log(333, res);
    if (res[0].code === 200) {
      setJobRange(res[0].data)
    }
    if (res[1].code === 200) {
      setPatientRange(res[1].data);
    }
  }
  const getComboList = async () => {
    const res = await getComboInfoByComboIdApi();
    if (res.code === 200) {
      const {comboId, price, name} = res.data;
      comboId && setComboId(comboId);
      price && setPrice(price);
      name && setComboName(name);
    }
  }
  const getCommunityInfo = async (communityId) => {
    const res = await getCommunityInfoApi(communityId);
    if (res.code == 200) {
      const {communityName, orgId, communityId} = res.data;
      communityName && setOrgName(communityName),
      orgId && setOrgId(orgId);
      communityId && setCommunityId(communityId);
    }
  }
  const scanQrCode = () => {
    Taro.scanCode({
      success: (res) => {
        if (res.result) {
          console.log(222, res);
          getCommunityInfo(res.result);
        }

      },
      fail: (res => {
        console.log(111, res);
      })
    })
  }

  const getRandomCode = () => {
    let code = "";
    const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
      'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
      'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    for (let i = 0; i < 4; i++) {
      let id = Math.round(Math.random() * 61);
      code += array[id];
    }
    return code;
  }
  const getImageCode = async () => {
    // const res = await  fetchImgCodeApi({})
    // console.log(333,res);
    const code = getRandomCode();
    Taro.request({
      url: Api.getImgCode,
      data: {code},
      method: "GET",
      header: {
        'Content-Type': 'application/json',
        // 'X-Litemall-Token': Taro.getStorageSync('token')
      },
      responseType: 'arraybuffer',
      success: function (res) {
        console.log(333, res)
        let url = 'data:image/png;base64,' + Taro.arrayBufferToBase64(res.data);
        setImgCode(url);
        setCode(code);
      }
    })
  }
  const nextStep = async () => {
    if (isEmpty(communityId)) {
      Taro.showToast({
        title: '请先扫码获取机构',
        icon: 'none',
      })
      return;
    }
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
    if (code.toLowerCase() != verifyCode.toLowerCase()) {
      Taro.showToast({
        title: '验证码输入不正确',
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
    if (isEmpty(jobCase)) {
      Taro.showToast({
        title: '请选择从业状况',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(patientType)) {
      Taro.showToast({
        title: '请选择患者类型',
        icon: 'none',
      })
      return;
    }
    // // 用户即选择40元混检测，又选择住院患者和陪同人员时，提示“住院和陪同人员请选择单样本检测”
    // if(patientId==3&&(!comboName.includes('单样本'))||patientId==2&&(!comboName.includes('单样本'))){
    //     Taro.showToast({
    //       title:'住院患者和陪同人员请选择单样本检测',
    //       icon:'none',
    //     })
    //   return;
    // }

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
    let item = {
      cityid,
      date,
      districtid,
      docUrl,
      idCard,
      name,
      orgId,
      payType,
      phone,
      area,
      communityId,
      communityFlag,
      timeType,
      provinceid,
      sourceId,
      streetdesc,
      userType,
      orgName,
      price,
      comboName,
      patientId,
      patientType,
      jobCase,
      comboId,
      jobId,
    };

    Taro.navigateTo({
      url: `/subPackages/pages/home/confirm/confirm?item=${JSON.stringify(item)}&userType=2`
    })
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

  const getLocation = () => {
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          authorize();
        } else {
          _chooseLocation();
        }
      },
    })

  }
  const authorize = () => {
    Taro.authorize({
      scope: 'scope.userLocation',
      success: function () {
        // 用户已经同意小程序使用录音功能，后续调用 Taro.chooseLocation 接口不会弹窗询问
        _chooseLocation();
      },
      fail: function (res) {
        setOpenSetting(true);
      }
    })
  }
  const _openSetting = () => {
    Taro.openSetting({
      success: function (res) {
        setOpenSetting(false)
        if (!res.authSetting['scope.userLocation']) {

        }
      }
    })
  }
  const _chooseLocation = () => {
    Taro.chooseLocation({
      success: function (res) {
        const {address, latitude, longitude} = res;
        let url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=${Api.key}&radius=1000&extensions=all&roadlevel=1`
        Taro.request({
          url,
          data: {},
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            const data = res.data;
            if (data.infocode == 10000) {
              const res = data.regeocode.addressComponent
              let provinceId = res.adcode.substring(0, 2) + '0000';
              let cityId = res.adcode.substring(0, 4) + '00';
              let districtId = res.adcode;
              console.log(333, cityId);
              setArea(address);
              setProvinceId(provinceId);
              setCityId(cityId);
              setDistrictId(districtId);
            }
          }
        })


      },
      complete: function (res) {
        console.log(333, res);
      },
      fail: function (res) {
        console.log(1111, res);
      }
    })
  }
  const _selectJobCase = (e) => {
    console.log(999, e);
    setJobCase(jobCaseRange[e.detail.value].v_name);
    setJobId(jobCaseRange[e.detail.value].value_id)
  }
  const _selectPatientType = (e) => {
    setPatientType(patientTypeRange[e.detail.value].v_name);
    setPatientId(patientTypeRange[e.detail.value].value_id);
  }
  return (
    <View className='container'>
      <View className='main'>
        <View className='address-info-container' onClick={scanQrCode}>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>社区</Text>
                <Text className='select-city-text list-row-input'
                      style={orgName === '' ? 'color:#999' : 'color:#666'}>{orgName ? orgName : '请扫码获取机构名称'}</Text>
              </View>
              <Image src={Scanner} style='width:20PX;height:19PX;'/>
            </View>
          </View>
          <View className='line'/>
        </View>
        <View className='address-info-container'>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>预约日期</Text>
                <Text className='select-city-text _list-row-input'
                      style={orgName === '' ? 'color:#999' : 'color:#666'}>{date}</Text>
              </View>
              {/*<Image src={Scanner} style='width:20PX;height:19PX;'/>*/}
            </View>
          </View>
          <View className='line'/>
        </View>
        <ListRow className='list-row-input' type='text' onInput={(e) => {
          setName(e.detail.value);

        }} label='姓名' placeholder='请输入姓名'/>
        <ListRow className='list-row-input' type='number' onInput={(e) => {
          setPhone(e.detail.value);
        }} label='电话' placeholder='请输入电话号码'/>
        <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
              <Text className='list-row-text' style='margin-right:60rpx'>验证码</Text>
              <Input type='text' className='__list-row-input' onInput={(e) => {
                setVerifyCode(e.detail.value);
              }} placeholder={'请输入图片验证码'}
                     placeholderClass='list-row-input-placeholder'/>
              <View className='code-view' onClick={getImageCode}>
                <Image src={imgCode} className='img-code'/>
              </View>
            </View>
          </View>
          <View className='line'/>
        </View>
        <ListRow className='_list-row-input' type='idcard' onInput={(e) => {
          setIdCard(e.detail.value);
        }} label='身份证号' placeholder='请输入身份证号'/>
        <Picker mode='selector' rangeKey='v_name' range={jobCaseRange} onChange={_selectJobCase}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text'>从业状况</Text>
                  <Text className='select-city-text _list-row-input'
                        style={jobCase === '' ? 'color:#999' : 'color:#666'}>{isEmpty(jobCase) ? '请选择从业状况' : jobCase}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        {/*<Picker mode='selector' rangeKey='v_name' range={patientTypeRange} onChange={_selectPatientType}>*/}
        <View className='address-info-container'>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text'>患者类型</Text>
                <Text className='select-city-text _list-row-input'
                      style={patientType === '' ? 'color:#999' : 'color:#666'}>{isEmpty(patientType) ? '请选择患者类型' : patientType}</Text>
              </View>
              {/*<Image src={Forward} className='forward'/>*/}
            </View>
          </View>
          <View className='line'/>
        </View>
        {/*</Picker>*/}
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
            }} className='textarea-text' placeholder='街道、楼牌号等' placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>
        <View className='tip-container'>
          <Text className='tip'>温馨提示</Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            1. 就诊人信息必须是核酸检测者本人，姓名、身份证号必须和身份证内容保持完全一致，核酸检测取样前需要出示身份证核实身份，冒用身份需承担法律责任；
          </Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>2. 所有填写的信息务必做到真实，不要使用他人手机号进行验证，否则将会导致他人身份无法核验；</Text>
        </View>
        <View className='tip-view'>
          <Text className='tip-text'>
            3. 详细地址必须为本人现住宅或办公真实地址，精确到门牌号；
          </Text>
        </View>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={nextStep}>
          <Text className='btn-submit-text'>下一步</Text>
        </View>
      </View>
      <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
      <AtModal
        closeOnClickOverlay={false}
        isOpened={openSetting}
      >
        <View className='modal-view'>
          <Text className='modal-text'>请前往设置开启位置权限？</Text>
        </View>
        <AtModalAction>
          <Button className={'btn'} onClick={() => setOpenSetting(false)}>取消</Button>
          <Button onClick={_openSetting}>确定</Button>
        </AtModalAction>
      </AtModal>
    </View>
  )
}
const ListRow = (props) => {
  const {label, placeholder, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <Text className='list-row-text'>{label}</Text>
          <Input type={type} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'
          />
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}

export default WriteCommunityInfo
