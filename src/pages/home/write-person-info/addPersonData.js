import Taro from '@tarojs/taro'
import {Button, Image, Input, Text, Textarea, View} from '@tarojs/components'
import React, {useEffect, useState} from 'react';
import {AtActionSheet, AtActionSheetItem, AtInput, AtModal, AtModalAction} from "taro-ui"
import Down from '@assets/down.svg'
import './addPersonData.scss'
import {getCurrentInstance} from "@tarojs/runtime";
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import AddressPicker from "../../../components/addressPicker";
import Api from "../../../config/api";
import Location from '@assets/location.png';
const AddPersonData = () => {
  const [openSetting,setOpenSetting] =useState(false);
  const [isIphoneX,setIsIphoneX]=useState(false);
  const [imgCode,setImgCode] =useState('');
  const [userId, setUserId] = useState('');
  const [orgName,setOrgName] = useState('');
  const [price,setPrice] =useState(0);
  const [userType, setUserType] = useState(1);
  const [date, setDate] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [provinceid, setProvinceId] = useState('140000');
  const [cityid, setCityId] = useState('140100');
  const [districtid, setDistrictId] = useState('140105');
  const [streetdesc, setStreetDesc] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [entourageIdCard, setEntourageIdCard] = useState('');
  const [entourageName, setEntourageName] = useState('');
  const [entouragePhone, setEntouragePhone] = useState('');
  const [entourageRelation, setEntourageRelation] = useState('父亲');
  // payType	支付方式 0 线上支付
  const [payType, setPayType] = useState(0);
  const [relationList, setRelationList] = useState([{label: 0, value: "父亲"}, {label: 1, value: '母亲'},
    {label:2, value: '丈夫'},
    {label:3,value:'妻子'},
    {label:4,value:'儿子'},
    {label:5,value:'女儿'},
    {label:6,value:'其他亲属'},
    {label:6,value:'非亲属'},
  ])
  const [code,setCode] =useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [area, setArea] = useState('请选择所属区域');
  const [visible, setVisible] = useState(false);
  const [insEscortStaff, setInsEscortStaff] = useState(false);
  const [verifyCode,setVerifyCode] =useState('');
  const [timeType,setTimeType] =useState('');
  const [modal,setModal]=useState(false);
  useEffect(() => {
    _initData();
    getImageCode();
  }, [])
  const _initData = async () => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const {item, userType} = getCurrentInstance().router.params;
    const {sourceId, orgId,timeType, date,orgName,price} = JSON.parse(item);
    setSourceId(sourceId);
    setOrgId(orgId);
    setDate(date);
    setOrgName(orgName);
    setPrice(price);
    setTimeType(timeType);
    setIsIphoneX(isIphoneX);
  }
  const getRandomCode=() =>{
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
  const getImageCode=async ()=>{
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
        console.log(333,res)
        let url ='data:image/png;base64,'+Taro.arrayBufferToBase64(res.data);
        setImgCode(url);
        setCode(code);
      }
    })
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
  const authorize =()=>{
    Taro.authorize({
      scope: 'scope.userLocation',
      success: function () {
        // 用户已经同意小程序使用录音功能，后续调用 Taro.chooseLocation 接口不会弹窗询问
        _chooseLocation();
      },
      fail:function (res){
        setOpenSetting(true);
      }
    })
  }
  const _openSetting=()=>{
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
              let provinceId = res.adcode.substring(0,2)+'0000';
              let cityId =res.adcode.substring(0,4)+'00';
              let districtId = res.adcode;
              console.log(333,cityId);
              setArea(address);
              setProvinceId(provinceId);
              setCityId(cityId);
              setDistrictId(districtId);
            }
          }
        })


      },
      complete: function (res) {
        console.log(333,res);
      },
      fail: function (res) {
        console.log(1111,res);
      }
    })
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
    if (isEmpty(provinceid) && isEmpty(cityid) && isEmpty(districtid)) {
      Taro.showToast({
        title: '请选择所属区域',
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
    if(insEscortStaff){
      if (isEmpty(entourageName)){
        Taro.showToast({
          title: '陪同人姓名不能为空',
          icon: 'none',
        })
        return;
      }
      if (!isMobile(entouragePhone)) {
        Taro.showToast({
          title: '陪同人手机号格式不正确',
          icon: 'none',
        })
        return;
      }


      if(entourageIdCard===idCard) {
        Taro.showToast({
          title: '身份证号不允许重复',
          icon: 'none',
        })
        return;
      }

      if (!isIdCard(entourageIdCard)) {
        Taro.showToast({
          title: '陪同人身份证号格式不正确',
          icon: 'none',
        })
        return;
      }
    }
    let item ={
      cityid,
      date,
      docUrl,
      entourageIdCard,
      entourageName,
      entouragePhone,
      entourageRelation,
      districtid,
      orgId,
      payType,
      provinceid,
      sourceId,
      streetdesc,
      userId,
      userType,
      timeType,
      area,
      orgName,name,
      phone,idCard,price
    }
    console.log(
      333,
      userType,
      provinceid,docUrl,cityid,districtid,name,phone,idCard, streetdesc,
      entourageIdCard,entourageRelation,entourageName,entouragePhone,
    );
    Taro.navigateTo({
      url: `/pages/home/certification/certification?item=${JSON.stringify(item)}`
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
  const insEscortStaffClick = (flag) => {
    setInsEscortStaff(flag);
  }
  const showAreaPicker = () => {
    setShowPicker(true);
  }
  const deleteEntourage=()=>{
    setModal(true);
  }
  const _enter=()=>{
    setModal(false);
    setEntourageRelation('');
    setEntourageName('');
    setEntourageIdCard('');
    setEntouragePhone('');
    setInsEscortStaff(false)
  }
  return (
    <View className='container'>
      <View className='main'>
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
              <Input type='text' className='__list-row-input' onInput={(e)=>{
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
        <View className='address-info-container' onClick={getLocation}>
          <View className='address-info-wrap'>
            <View className='address-info-view flex-between'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text' style={'color:#333'}>地区信息</Text>
                <Text className='select-city-text _list-row-input' style={'color:#999'}>{area}</Text>
              </View>
              <Image src={Location} className='location'/>
            </View>
          </View>
          <View className='line'/>
        </View>
        <View className='detail-address-container'>
          <View className='detail-address-textarea'>
            <Textarea  className='textarea-text' onInput={e => {
              setStreetDesc(e.detail.value)
            }} placeholder='街道、楼牌号等' placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>

        {!insEscortStaff ? <View className='acc-info-view' onClick={() => insEscortStaffClick(true)}>
          <Text className='acc-info-text'>增加陪同人员</Text>
        </View> : null}
        {insEscortStaff ?
          <View className='acc-info-container'>
            <ListRow className='list-row-input' type='text' onInput={(e) => {
              setEntourageName(e.detail.value);

            }} label='姓名' placeholder='请输入姓名'/>
            <View className='address-info-container' onClick={()=>setVisible(true)}>
              <View className='address-info-wrap'>
                <View className='address-info-view'>
                  <View style='display:flex;alignItems:center'>
                    <Text className='dist-name-text'>与患者关系</Text>
                    <Text className='select-city-text _list-row-input' style={'color:#999'}>{entourageRelation}</Text>
                  </View>
                  <Image src={Down} className='list-row-down'/>
                </View>
              </View>
              <View className='line'/>
            </View>
            <ListRow className='list-row-input' type='number' onInput={(e) => {
              setEntouragePhone(e.detail.value);
            }} label='电话' placeholder='请输入电话'/>
            <ListRow className='_list-row-input' type='idcard' onInput={(e) => {
              setEntourageIdCard(e.detail.value);
            }} label='身份证号' placeholder='请输入身份证号'/>
          </View> : null}
        {insEscortStaff ? <View className='acc-info-cancel' onClick={deleteEntourage} >
          <Text className='acc-info-cancel-text'>删除陪同人员</Text>
        </View> : null}
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
        <AtActionSheet isOpened={visible} onCancel={() => setVisible(false)} onClose={() => setVisible(false)}
                       cancelText='取消'>
          {relationList.map(item => {
            return (
              <AtActionSheetItem key={item.label + ""} onClick={() => {
                setVisible(false);
                setEntourageRelation(item.value)
              }
              }>
                {item.value}
              </AtActionSheetItem>
            )
          })}
        </AtActionSheet>
        <AddressPicker pickerShow={showPicker} onHandleToggleShow={toggleAddressPicker}/>
      </View>
      <View className='footer'>
        <View className='btn-submit-view' style={isIphoneX?'margin-bottom:34rpx':'margin-bottom:0rpx'} onClick={nextStep}>
          <Text className='btn-submit-text'>下一步</Text>
        </View>
      </View>
      <AtModal
        closeOnClickOverlay={false}
        isOpened={modal}
      >
        <View className='modal-view'>
          <Text className='modal-text'>确定删除该陪同人信息吗？</Text>
        </View>
        <AtModalAction>
          <Button onClick={()=>setModal(false)}>取消</Button>
          <Button onClick={_enter}>确定</Button>
        </AtModalAction>
      </AtModal>
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
          <Input  type={type} className={className} onInput={onInput} placeholder={placeholder}
                  placeholderClass='list-row-input-placeholder'/>
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}
export default AddPersonData
