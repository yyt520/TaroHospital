import Taro from '@tarojs/taro'
import {
  Checkbox,
  CheckboxGroup,
  Image,
  Input,
  Picker,
  Radio,
  RadioGroup,
  ScrollView,
  Text,
  View
} from '@tarojs/components'
import React, {useEffect, useLayoutEffect, useState} from 'react';
import './index.scss'
import {isEmpty} from "../../../utils/EmptyUtil";
import {isIdCard, isMobile} from "../../../utils/RegUtil";
import Forward from '@assets/home/forward.svg'
import {
  callAddEpidemicSurveyApi,
  callDeptListApi, callHighAreaApi, callMidHighAreaApi,
  callXG22ListApi,
  callXGPersonSortApi,
  getJobCaseDicApi
} from "../../../services/home";
import {getCurrentInstance} from "@tarojs/runtime";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import arrow from '@assets/arrow.svg';
const EpidemicSurvey = () => {
  const [isIphoneX, setIsIphoneX] = useState(false);
  const [addrHome, setAddrHome] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [idCard, setIdCard] = useState('');
  const [temperature, setTemperature] = useState('');
  const [clinicDeptRange, setClinicDeptRange] = useState([]);
  const [clinicDept, setClinicDept] = useState('');
  const [clinicDeptId, setClinicDeptId] = useState('');
  const [entourageIdCard, setEntourageIdCard] = useState('');
  const [entourageName, setEntourageName] = useState('');
  const [jobCase, setJobCase] = useState('');
  const [jobId, setJobId] = useState('');
  const [jobCaseRange, setJobRange] = useState([])
  const [personType, setPersonType] = useState('');
  const [personTypeId, setPersonTypeId] = useState('');
  const [personTypeRange, setPersonTypeRange] = useState([]);
  const [personType22, setPersonType22] = useState('');
  const [personTypeId22, setPersonTypeId22] = useState('');
  const [personTypeRange22, setPersonTypeRange22] = useState([]);
  const [multiArray, setMultiArray] = useState([]);
  const [picker_key, setPickerKey] = useState([]);
  const [clinicList] = useState([
    {
      deptName: '门诊医生站',
      deptCode: '03',
    },
    // {
    //   deptName:'住院医生站',
    //   deptCode:'01',
    // }
  ])
  const [patientRelationRange, setPatientRelationRange] = useState([
    "本人",
    "父亲",
    '母亲',
    "爷爷",
    '奶奶',
    '丈夫',
    '妻子',
    '儿子',
    '女儿',
    '其他亲属',
    '非亲属',
  ]);
  const [patientRelation, setPatientRelation] = useState('');
  const [agree, setAgree] = useState([]);
  const [userType, setUserType] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [zeroValue, setZeroValue] = useState('');
  const [yellowSource, setYellowSource] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [ifTrhistoryNote, setIfTrhistoryNote] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [thirdValue, setThirdValue] = useState('');
  const [ifSymptomsNote, setIfSymptomsNote] = useState('');
  const [forthValue, setForthValue] = useState('');
  const [fifthValue, setFifthValue] = useState('');
  const [sixthValue, setSixthValue] = useState('');
  const [accidValue, setAccidValue] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [item, setItem] = useState({});
  const [cityid, setCityId] = useState('');
  const [personId, setPersonId] = useState('');
  const [provinceid, setProvinceId] = useState('');
  const [districtid, setDistrictId] = useState('');
  const [streetdesc, setStreetDesc] = useState('');
  const [identity, setIdentity] = useState('');
  const [who,setWho]=useState('');
  const [midHighDangerAreaRange, setMidHighDangerAreaRange] = useState([])
  const [highDangerAreaList, setHighDangerAreaList] = useState([]);
  const [symptOther,setSmptomsOther]=useState('');
  const [trOther,setTrOther]=useState('');
  // payType	支付方式 0 线上支付 1 线下支付
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '流行病学调查表'
    })
  }, [])
  useEffect(() => {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    setIsIphoneX(isIphoneX);
    let {item, userType} = getCurrentInstance().router.params;
    const _item = JSON.parse(item);
    const {
      date,
      docUrl,
      idCard,
      name,
      orgId,
      payType,
      phone,
      area,
      timeType,
      sourceId,
      orgName,
      price,
      comboName,
      cityid,//城市id
      districtid,//区县id
      personId,//就诊人id
      provinceid,//省直辖市id
      streetdesc,//街道详情
      jobId,
      jobName,
      addrHome,
      relation,
    } = _item;
    setUserType(userType);
    setItem(_item);
    setName(name);
    setPhone(phone);
    setIdCard(idCard);
    setJobCase(jobName);
    setJobId(jobId);
    setAddrHome(addrHome);
    setPatientRelation(relation);
    setProvinceId(provinceid);
    setCityId(cityid);
    setDistrictId(districtid);
    setStreetDesc(streetdesc);
    setPersonId(personId);
    setIsIphoneX(isIphoneX);
    initData();
  }, [])
  const initData = async () => {
    // callDeptListApi(),
    Taro.showLoading({
      title:'请稍等...',
      mask:true,
    })
    const {personId}=getCurrentInstance().router.params;
    const res = await Promise.all([getJobCaseDicApi(), callXG22ListApi(), callXGPersonSortApi(), callMidHighAreaApi(), callHighAreaApi()]);
    console.log(333, res);
    if (res[0].code === 200) {
      setJobRange(res[0].data)
    }
    if (res[1].code == 200) {
      setPersonTypeRange22(res[1].data);
    }
    if (res[2].code == 200) {
      setPersonTypeRange(res[2].data);
    }
    if (res[3].code == 200) {
      setMidHighDangerAreaRange([...res[3].data.confValue.split(','), '其他'])
    }
    if (res[4].code == 200) {
      setHighDangerAreaList([...res[4].data.confValue.split(','), '其他'])
      // setHighDangerAreaList(res[4].data);
    }
    for(let i =0;i<clinicList.length;i++){
      let item = clinicList[i];
      let res = await callDeptListApi({supId:item.deptCode})
      if(res.code ==200){
        if(item.deptCode=='03'){
          item.deptCode=='03'&&console.log(11,res.data);
          try {
            res.data.forEach((item,index) => {
              if (item.deptCode == '03076') {
                res.data.unshift(res.data.splice(index, 1)[0])
                throw new Error()
              }
            })
          }catch (e){
            item.children = res.data;
          }
        }else {
          item.children = res.data;
        }
      }
    }
    console.log(333,clinicList);
    getPickerCity([0, 0, 0]);
    Taro.hideLoading();
  }
  const getPickerCity = (key) => {

    let province = [];//省
    let city = [];//市
    // let county = [];//区

    //省
    clinicList.forEach(provinces => {
      province.push(provinces['deptName'])
    });

    //市
    if (clinicList[key[0]]['children'] && clinicList[key[0]]['children'].length > 0) {
      clinicList[key[0]]['children'].forEach(citys => {
        city.push(citys['deptName'])
      })
    }
    // //区县
    // clinicList[key[0]]['children'][key[1]]['children'].forEach(countys => {
    //   county.push(countys['text'])
    // });
    let alls = [];
    alls.push(province)
    alls.push(city)
    // alls.push(county)
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
      // case 2:
      //   getPickerCity([picker_key[0], picker_key[1], value])
      //   break;
      default:
        break;
    }
  }
  const cityChangePicker = (e) => {
    let value = e.detail.value;
    if (clinicList.length > 0) {
      // let province = clinicList[value[0]];
      let city = clinicList[value[0]].children[value[1]];
      console.log(3333,city);
      // let district = clinicList[value[0]].children[value[1]].children[value[2]];
      // setProvinceId(province.value);
      setClinicDept(city.deptName);
      setClinicDeptId(city.deptCode)
      // setDistrictId(district.value);
      // console.log(2222, province.value, city.value, district.value);
      // let id = cityRange[value[0]].children[value[1]].children[value[2]].value
    }
  }
  const nextStep = async () => {
    let sex = '', age = 0;
    if(isEmpty(identity)){
      Taro.showToast({
        title: '请选择您的身份',
        icon: 'none'
      })
      return;
    }
    if(identity=='陪护') {
      if(isEmpty(who)){
        Taro.showToast({
          title: '请输入您是谁的陪护？',
          icon: 'none'
        })
        return;
      }
    }
    if (isEmpty(name)) {
      Taro.showToast({
        title: '姓名不能为空',
        icon: 'none'
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
    let org_birthday = idCard.substring(6, 14);
    let org_gender = idCard.substring(16, 17);
    sex = org_gender % 2 == 1 ? "男" : "女";
    let birthday = org_birthday.substring(0, 4) + "-" + org_birthday.substring(4, 6) + "-" + org_birthday.substring(6, 8);
    let birthdays = new Date(birthday.replace(/-/g, "/"));
    let d = new Date();
    age = d.getFullYear() - birthdays.getFullYear() - (d.getMonth() < birthdays.getMonth() || (d.getMonth() == birthdays.getMonth() && d.getDate() < birthdays.getDate()) ? 1 : 0);
    // console.log('生日转换时间', birthdays)
    // console.log('年龄', age)
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

    if (isEmpty(addrHome)) {
      Taro.showToast({
        title: '家庭住址不能为空',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(clinicDept)) {
      Taro.showToast({
        title: '请选择就诊科室',
        icon: 'none',
      })
      return;
    }
    if (isEmpty(personType)) {
      Taro.showToast({
        title: '请选择人群分类',
        icon: 'none',
        duration: 3500
      })
      return;
    }
    // if(isEmpty(personType22)){
    //   Taro.showToast({
    //     title:'请选择22类人群',
    //     icon:'none',
    //     duration:3500
    //   })
    //   return;
    // }
    if (!isEmpty(temperature)) {
      if (isNaN(temperature)) {
        Taro.showToast({
          title: '请填写体温有效值',
          icon: 'none',
        })
        return;
      }
    }
    if (!isEmpty(entourageName)) {
      if (isEmpty(entourageIdCard)) {
        Taro.showToast({
          title: '陪同人身份证号不能为空',
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
      if (entourageIdCard === idCard) {
        Taro.showToast({
          title: '陪同人身份证号不允许与就诊人重复',
          icon: 'none',
        })
        return;
      }
      if (isEmpty(patientRelation)) {
        Taro.showToast({
          title: '请选择患者关系',
          icon: 'none',
        })
        return;
      }
    }
    if(zeroValue==1){
      if(isEmpty(yellowSource)){
        Taro.showToast({
          title: '请选择所处区域',
          icon: 'none',
        })
        return;
      }
    }
    if (firstValue == 1) {
      if (isEmpty(ifTrhistoryNote)) {
        Taro.showToast({
          title: '请选择所处中高风险的地区',
          icon: 'none',
        })
        return;
      }
      if(ifTrhistoryNote=='其他'){
        if(isEmpty(trOther)){
          Taro.showToast({
            title: '请输入其他区域',
            icon: 'none',
          })
          return;
        }
      }
    }

    if (thirdValue == 1) {
      if (isEmpty(ifSymptomsNote)) {
        Taro.showToast({
          title: '请选择具有高危风险的患者地区',
          icon: 'none',
        })
        return;
      }
      if(ifSymptomsNote=='其他'){
        if(isEmpty(symptOther)){
          Taro.showToast({
            title: '请输入其他区域',
            icon: 'none',
          })
          return;
        }
      }
    }
    if (fifthValue == 1) {
      if (isEmpty(sixthValue)) {
        wx.showToast({
          title: '请选择症状',
          icon: 'none'
        })
        return;
      }
    }
    if (isEmpty(zeroValue)||isEmpty(firstValue) || isEmpty(secondValue) || isEmpty(thirdValue) || isEmpty(forthValue) || isEmpty(fifthValue)||isEmpty(accidValue)) {
      wx.showToast({
        title: '存在未完成的内容，请完成后再提交',
        icon: 'none'
      })
      return;
    }
    if (agree.length === 0) {
      wx.showToast({
        title: '尚未完成流调表，请勾选页面下方承诺内容',
        icon: 'none'
      })
      return;
    }
    // const symptomList = [
    //   fifthValue,
    //   secondValue,
    //   thirdValue,
    //   forthValue,
    //   fifthValue
    // ];
    // let bool = symptomList.some(item => item == 1);
    Taro.showLoading({
      title: '请稍等...'
    })
    const $res = await user.loginByWeixin({appid: Config.appid});
    if ($res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = $res.data;
      const res = await callAddEpidemicSurveyApi({
        userId,
        idCard,
        isCase: firstValue,
        isCthistory: secondValue,
        isSymptoms: thirdValue,
        isTrhistory: forthValue,
        isWeekbx: fifthValue,
        isWeekbxOther: sixthValue,
        job: jobId,
        jobName: jobCase,
        patientName: name,
        phone,
        sex,
        temperature,
        addrHome,
        dpId: clinicDeptId,
        dpName: clinicDept,
        throng: personTypeId,//人群分类字典id
        throngName: personType,//人群分类名字
        spThrong: personTypeId22,//特殊人群分类字典id
        spThrongName: personType22,//特殊人群分类名字
        entourageIdCard,
        entourageName,
        entourageRelation: patientRelation,
        cityid,//城市id
        districtid,//区县id
        personId,//就诊人id
        provinceid,//省直辖市id
        streetdesc,//街道详情
        report48:accidValue,
        yellowSource:yellowSource,
        identity:identity=='陪护'?who+`的陪护`:identity,
        ifTrhistoryNote:ifTrhistoryNote=='其他'?trOther:ifTrhistoryNote,
        ifSymptomsNote:ifSymptomsNote=='其他'?symptOther:ifSymptomsNote
      })
      if (res.code == 200) {
        const {personId,item}=getCurrentInstance().router.params;
        let $item = JSON.parse(item);
        Taro.navigateTo({
          url: `/pages/home/write-patient-info/writePatientInfo?item=${JSON.stringify({...$item})}&personId=${personId}&userType=${userType}`
        })
      } else {
        Taro.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      Taro.hideLoading();
    }
    // Taro.navigateTo({
    //   url: `/pages/home/confirm/confirm?item=${JSON.stringify(item)}&userType=2`
    // })
  }
  const selectPatientRelation = (e) => {
    setPatientRelation(patientRelationRange[e.detail.value]);
  }
  const personTypeChange = (e) => {
    setPersonType(personTypeRange[e.detail.value].v_name);
    setPersonTypeId(personTypeRange[e.detail.value].value_id);
  }
  const personTypeChange22 = (e) => {
    setPersonType22(personTypeRange22[e.detail.value].v_name);
    setPersonTypeId22(personTypeRange22[e.detail.value].value_id);
  }
  const firstRadioGroupChange = (e) => {
    if(e.detail.value==0){
      setIfTrhistoryNote('');
    }
    setFirstValue(e.detail.value);
  }
  const secondRadioGroupChange = (e) => {
    setSecondValue(e.detail.value)
  }
  const thirdRadioGroupChange = (e) => {
    if(e.detail.value==0){
      setIfTrhistoryNote('');
    }
    setThirdValue(e.detail.value)
  }
  const forthRadioGroupChange = (e) => {
    setForthValue(e.detail.value)
  }
  const fifthRadioGroupChange = (e) => {
    setIsDisabled(false);
    setFifthValue(e.detail.value);
    if (e.detail.value == 1) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
      setSixthValue('');
    }
  }
  const sixthRadioGroupChange = (e) => {
    setSixthValue(e.detail.value);
  }
  const agreeCheckboxChange = (e) => {
    setAgree(e.detail.value);
  }
  const selectJobCase = (e) => {
    setJobCase(jobCaseRange[e.detail.value].v_name);
    setJobId(jobCaseRange[e.detail.value].value_id)
  }
  const selectMidHighDangerArea = (e) => {
    setIfTrhistoryNote(e.detail.value);
  }
  const accidRadioGroupChange = (e) => {
    setAccidValue(e.detail.value);
  }
  const selectHighDangerArea = (e) => {
    setIfSymptomsNote(e.detail.value);
  }
  const zeroRadioGroupChange = (e) => {
    if(e.detail.value==0){
      setYellowSource('');
    }
    setZeroValue(e.detail.value);
  }
  const selectIdentity = (e) => {
    setIdentity(e.detail.value);
  }
  const selectManageControlArea = (e) => {
    setYellowSource(e.detail.value);
  }
  const onGoMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId:'wxbebb3cdd9b331046',
      path:'publicService/pages/riskArea/index?previoufooter=本服务由国家卫生健康委提供&previoutitle=疫情风险等级查询'
    })
  }
  return (
    <View className='container'>
      <ScrollView showScrollbar={false} enhanced={true}>
        <View className='header-top'>
          <View className='viewHeader'>
            <Text style='color:#333;font-size:15PX;'>廊坊市中医院</Text>
            <Text style='color:#333;font-size:15PX;'>新冠肺炎疫情期间流行病学调查表</Text>
          </View>
        </View>
        <View className='viewNotice'>
          <Text style='color:red;font-size:14PX'>
            根据《中华人民共和国传染病防治法》以及当前疫情防控要求，需要对您进行医学询问，请您如实回答。
          </Text>
          <View onClick={onGoMiniProgram} className='skip-mini'>
            <Text style='color:#3991fa;font-size:14PX'>全国疫情风险地区实时数据查询</Text>
            <Image src={arrow} className='forward'/>
          </View>
        </View>
        <View className='address-info-wrap'>
          <View className='address-info-view' style='justify-content:flex-start'>
            <View style='display:flex;alignItems:center;margin-right:65PX;'>
              <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
              <Text className='dist-name-text'>您的身份</Text>
            </View>
            <RadioGroup onChange={selectIdentity}>
              <View style='display:flex;flexWrap:wrap;justifyContent:flex-start'>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D'
                       value='患者' checked = {
                  identity=='患者'
                }>患者</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='陪护' checked = {
                  identity=='陪护'
                }>陪护</Radio>
              </View>
            </RadioGroup>
          </View></View>
        <View className='line'/>
        {identity=='陪护'&&<View style='height:44PX;display:flex;flex-direction:column;justify-content:center'>
          <View style='display:flex;flex-direction:row;align-items:center;'>
            <Input type="text" style='flex:1;text-align:center;' onInput={e=>{
              setWho(e.detail.value);
            }} placeholder='请登记下您是谁的陪护?' placeholderClass='list-row-input-placeholder'/>
          </View>
        </View>}
        {identity=='陪护'&&<View className='line'/>}
        <ListRow disabled={true} value={name} required className='list-row-input' type='text' label='患者姓名'
                 placeholder='请填写真实姓名'/>
        <ListRow disabled={true} value={idCard} required className='list-row-input' type='idcard' label='身份证号'
                 placeholder='请输入身份证号'/>
        <ListRow disabled={true} value={phone} required className='list-row-input1' type='number' label='手机号'
                 placeholder='请填写患者手机号码'/>
        <ListRow disabled={true} value={addrHome} required className='list-row-input' type='text' label='家庭住址'
                 placeholder='请填写住址，详细至门牌号'/>
        <Picker value={picker_key} mode="multiSelector" onChange={cityChangePicker}
                onColumnchange={cityColumnChangePicker} range={multiArray}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
                  <Text className='dist-name-text'>就诊科室</Text>
                  <Text className='select-city-text list-row-input'
                        style={clinicDept === '' ? 'color:#999' : 'color:#666'}>{isEmpty(clinicDept) ? '请选择就诊科室' : clinicDept}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        <Picker mode='selector' rangeKey='v_name' range={personTypeRange} onChange={personTypeChange}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
                  <Text className='dist-name-text'>人群分类</Text>
                  <Text className='select-city-text list-row-input'
                        style={personTypeId === '' ? 'color:#999' : 'color:#666'}>{isEmpty(personTypeId) ? '请选择人群分类' : personType}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        {/*<Picker mode='selector' rangeKey='v_name' range={personTypeRange22} onChange={personTypeChange22}>*/}
        {/*  <View className='address-info-container'>*/}
        {/*    <View className='address-info-wrap'>*/}
        {/*      <View className='address-info-view'>*/}
        {/*        <View style='display:flex;alignItems:center'>*/}
        {/*          <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>*/}
        {/*          <Text className='dist-name-text'>22类人群</Text>*/}
        {/*          <Text className='select-city-text list-row-input'*/}
        {/*                style={personTypeId22 === '' ? 'color:#999' : 'color:#666'}>{isEmpty(personTypeId22) ? '请选择22类人群' : personType22}</Text>*/}
        {/*        </View>*/}
        {/*        <Image src={Forward} className='forward'/>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*    <View className='line'/>*/}
        {/*  </View>*/}
        {/*</Picker>*/}
        <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text style='font-size:14PX;color:red;margin-right:2PX;'/>
                <Text className='list-row-text' style='margin-left:7PX;'>当前体温</Text>
              </View>
              <Input type='digit' className='list-row-input' onInput={(e) => {
                setTemperature(e.detail.value);
              }} placeholder={'请填写当前体温'}
                     placeholderClass='list-row-input-placeholder'/>
              <View>
                <Text style='font-size:14PX;color:#666'>℃</Text>
              </View>
            </View>
          </View>
          <View className='line'/>
        </View>
        <Picker disabled={true} mode='selector' rangeKey='v_name' range={jobCaseRange} onChange={selectJobCase}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text style='font-size:14PX;color:red;margin-left:10PX;'/>
                  <Text className='dist-name-text'>从业状况</Text>
                  <Text className='select-city-text list-row-input'
                        style={jobCase === '' ? 'color:#999' : 'color:#666'}>{isEmpty(jobCase) ? '请选择职业' : jobCase}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        <ListRow value={entourageName} className='list-row-input' type='text' onInput={(e) => {
          setEntourageName(e.detail.value);
        }} label='陪同人员' placeholder='请填写陪同人真实姓名'/>
        <ListRow value={entourageIdCard} className='list-row-input' type='idcard' onInput={(e) => {
          setEntourageIdCard(e.detail.value);
        }} label='身份证号' placeholder='请输入陪同人身份证号'/>
        <Picker mode='selector' disabled={true} range={patientRelationRange} onChange={selectPatientRelation}>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text className='dist-name-text' style='margin-left:3PX;'>与患者关系</Text>
                  <Text className='select-city-text list-row-input2'
                        style={patientRelation === '' ? 'color:#999' : 'color:#666'}>{isEmpty(patientRelation) ? '请选择与患者的关系' : patientRelation}</Text>
                </View>
                <Image src={Forward} className='forward'/>
              </View>
            </View>
            <View className='line'/>
          </View>
        </Picker>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'
                  className='notice'>1.您是来自封控区、管控区、重点防范区、集中隔离点、居家医学观察、健康监测及健康码为红码和黄码的人员.</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={zeroRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>是</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>否</Radio>
            </RadioGroup>
          </View>
        </View>
        {zeroValue == 1 ?
          <View style='margin-top:10PX;display:flex;flex-direction:row;align-items:center;margin-left:10PX'>
            <RadioGroup onChange={selectManageControlArea}>
              <View style='display:flex;flexWrap:wrap;justifyContent:flex-start'>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D'
                       value='封控区'>封控区</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='管控区'>管控区</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='重点防范区'>重点防范区</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='集中隔离点'>集中隔离点</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='居家医学观察'>居家医学观察</Radio>
                <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                       color='#06B48D' value='健康监测及健康码为红码和黄码的人员'>健康监测及健康码为红码和黄码的人员</Radio>
              </View>
            </RadioGroup>
          </View> : <View/>}
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX' className='notice'>2.发病前14天内是否有病例或无症状感染者报告社区的居住或旅行史？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={firstRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
        </View>
        {firstValue == 1 ?
          <View style='margin-top:10PX;display:flex;flex-direction:row;align-items:center;margin-left:10PX'>
            <RadioGroup onChange={selectMidHighDangerArea}>
              <View style='display:flex;flex-wrap:wrap;justify-content:flex-start'>

                {midHighDangerAreaRange.map(item => {
                  console.log(333, item);
                  return (
                    <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                           color='#06B48D'
                           value={item}>{item}</Radio>)
                })}
              </View>
            </RadioGroup>
            {ifTrhistoryNote == '其他' && <View style='height:44PX;display:flex;flex-direction:column;justify-content:center'>
              <View style='display:flex;flex-direction:row;align-items:center;'>
                <Input type="text" style='flex:1;text-align:left;' onInput={e => {
                  setTrOther(e.detail.value);
                }} placeholder='请输入其他区域' placeholderClass='list-row-input-placeholder'/>
              </View>
            </View>}
            {ifTrhistoryNote == '其他' && <View className='line'/>}
          </View> : <View/>}
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX' className='notice'>3.发病前14天内是否与新冠病毒核酸检测/IGg/IGM阳性或无症状感染者有接触史？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={secondRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text
              style='color:#333;font-size:14PX'
              className='notice'>4.发病前14天内是否接触过来自新冠肺炎中高风险地区，或境内其他有病例报告的社区，或境外疫情严重国家或地区的发热或有呼吸道症状的患者？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={thirdRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
        </View>
        {thirdValue == 1 ?
          <View style='margin-top:10PX;display:flex;flex-direction:row;align-items:center;margin-left:10PX'>
            <RadioGroup onChange={selectHighDangerArea}>
              <View style='display:flex;flex-wrap:wrap;justify-content:flex-start'>
                {highDangerAreaList.map(item => {
                  return (
                    <Radio style={{transform: 'scale(0.8)', color: '#333',}}
                           color='#06B48D'
                           value={item}>{item}</Radio>
                  )
                })}
              </View>
            </RadioGroup>
            {ifSymptomsNote == '其他' && <View style='height:44PX;display:flex;flex-direction:column;justify-content:center'>
              <View style='display:flex;flex-direction:row;align-items:center;'>
                <Input type="text" style='flex:1;text-align:center;' onInput={e => {
                  setSmptomsOther(e.detail.value);
                }} placeholder='请输入其他区域' placeholderClass='list-row-input-placeholder'/>
              </View>
            </View>}
            {ifSymptomsNote == '其他' && <View className='line'/>}
          </View> : <View/>}
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'
                  className='notice'>5.近14天您所在范围内，如家庭、办公室、学校班级、车间、工地等场所，是否出现2例及以上发热和/或呼吸道症状的病例？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={forthRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;margin-top:10PX;'>
          <View style='display:flex;flex-direction:row;margin-left:20PX'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'>6.您2周内有以下表现吗？</Text>
          </View>
          <View style='margin-top:10PX;margin-left:20PX;'>
            <RadioGroup onChange={fifthRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
          {!isHidden ?
            <View style='margin-top:10PX;display:flex;flex-direction:row;align-items:center;margin-left:10PX'>
              <RadioGroup onChange={sixthRadioGroupChange}>
                <View style='display:flex;'>
                  <Radio disabled={isDisabled} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                         color='#06B48D'
                         value='1'>发热</Radio>
                  <Radio disabled={isDisabled} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                         color='#06B48D' value='2'>咳嗽</Radio>
                  <Radio disabled={isDisabled} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                         color='#06B48D' value='3'>腹泻</Radio>
                  <Radio disabled={isDisabled} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                         color='#06B48D' value='4'>新冠肺炎其他症状</Radio>
                </View>
              </RadioGroup>
              {/*<CheckboxGroup onChange={checkboxChange}>*/}
              {/*  <Checkbox color='#06B48D' disabled={isDisabled}*/}
              {/*            style={{transform: 'scale(0.8,0.8)', color: isDisabled ? '#999' : '#333', }}*/}
              {/*            value='1'>发热</Checkbox>*/}
              {/*  <Checkbox color='#06B48D' disabled={isDisabled}*/}
              {/*            style={{transform: 'scale(0.8,0.8)', color: isDisabled ? '#999' : '#333',}}*/}
              {/*            value='2'>咳嗽</Checkbox>*/}
              {/*  <Checkbox color='#06B48D' disabled={isDisabled}*/}
              {/*            style={{transform: 'scale(0.8,0.8)', color: isDisabled ? '#999' : '#333',}}*/}
              {/*            value='3'>腹泻</Checkbox>*/}
              {/*  <Checkbox color='#06B48D' disabled={isDisabled}*/}
              {/*            style={{transform: 'scale(0.8,0.8)', color: isDisabled ? '#999' : '#333',}}*/}
              {/*            value='4'>新冠其他症状</Checkbox>*/}
              {/*</CheckboxGroup>*/}
            </View> : <View/>}
        </View>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'
                  className='notice'>7.是否有48小时核酸检测报告</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup onChange={accidRadioGroupChange}>
              <Radio style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1'>有</Radio>
              <Radio style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View className='dash-line' style='margin-top:10PX'/>
        <View style='margin-top:10PX;padding-left:10PX;display:flex;padding-bottom:77PX;'>
          <CheckboxGroup onChange={agreeCheckboxChange}>
            <Checkbox color='#06B48D' style={{transform: 'scale(0.8,0.8)', marginRight: '2PX'}} value='1'/>
          </CheckboxGroup>
          <View>
            <Text style='color:red;font-size:13PX;'
                  className='notice'>本人承诺，以上情况全部属实，如故意隐瞒病情或流行病学史导致漏诊或疫情传播，自愿承担相关法律责任。</Text>
          </View>
        </View>
      </ScrollView>
      <View className='footer'>
        <View className={disabled ? 'btn-submit-disabled' : 'btn-submit-view'}
              style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
              onClick={nextStep}>
          <Text className='btn-submit-text'>提交</Text>
        </View>
      </View>
    </View>
  )
}
const ListRow = (props) => {
  const {label, placeholder, value, disabled, required, className, type, onInput} = props;
  return (
    <View className='list-row-container'>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <View style='display:flex;align-items:center'>
            {required ? <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text> :
              <View style='margin-right:2PX;'/>}
            <Text className={required ? 'list-row-text' : 'list-row-text1'}>{label}</Text>
          </View>
          <Input type={type} value={value} disabled={disabled} className={className} onInput={onInput}
                 placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'
          />
        </View>
      </View>
      <View className='line'/>
    </View>
  )
}

export default EpidemicSurvey
