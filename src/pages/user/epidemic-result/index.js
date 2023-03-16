import {Image, Input, Radio, RadioGroup, Text, View} from "@tarojs/components";
import './index.scss';
import Taro from '@tarojs/taro'
import React, {useEffect, useLayoutEffect, useState} from "react";
import moment from "moment";
import {QRCode} from "taro-code";
import logo from '@assets/img.png';
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import {callEpidemicResultApi} from "../../../services/user";
import _Empty from "@assets/empty.png";
import forward from '@assets/home/forward.svg'
import {isEmpty} from "../../../utils/EmptyUtil";
import {getCurrentInstance} from "@tarojs/runtime";
const EpidemicResult = () => {
  const [foregroundColor, setForegroundColor] = useState('');
  const [isNormal,setIsNormal] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [ctstamp, setctstamp] = useState('');
  const [obj, setObj] = useState({});
  const [name, setName] = useState('');
  const [entourageName, setEntourageName] = useState('');
  const [entourageIdCard, setEntourageIdCard] = useState('');
  const [entourageRelation, setEntourageRelation] = useState('');
  const [idCard, setIdCard] = useState('');
  const [phone, setPhone] = useState('');
  const [clinicDept, setClinicDept] = useState('');
  const [patientRelation, setPatientRelation] = useState('');
  const [jobCase, setJobCase] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [addrHome, setAddrHome] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [temperature, setTemperature] = useState('');
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');
  const [forth, setForth] = useState('');
  const [fifth, setFifth] = useState('');
  const [personType,setPersonType]=useState('');
  const [personType22,setPersonType22]=useState('');
  const [isWeekbxOther, setIsWeekbxOther] = useState('');
  useLayoutEffect(() => {
    Taro.setNavigationBarTitle({
      title: '流调结果',
    })
  }, [])
  useEffect(() => {
    initData();
  }, [])
  const initData = async () => {
    let {item} = getCurrentInstance().router.params;
    let $item = JSON.parse(item);
            const {
              addrHome,
              ctstamp,
              dpId,
              dpName,
              entourageIdCard,
              entourageName,
              entourageRelation,
              idCard,
              isCase,
              isCthistory,
              isNormal,
              isSymptoms,
              isTrhistory,
              isWeekbx,
              isWeekbxOther,
              job,
              jobName,
              patientName,
              phone,
              sex,
              sheetDate,
              spThrong,
              spThrongName,
              temperature,
              throng,
              throngName,

            } = $item;
            setAddrHome(addrHome);
            setPersonType(throngName);
            setPersonType22(spThrongName);
            setClinicDept(dpName);
            setJobCase(jobName);
            setIdCard(idCard);
            setName(patientName);
            setPhone(phone);
            setctstamp(sheetDate);
            setTemperature(temperature);
            if(isNormal==1){
              setForegroundColor('#FF3938');
            }else {
              setForegroundColor('#2CA568')
            }
            setIsNormal(isNormal);
            setFirst(isCase);
            setSecond(isCthistory);
            setThird(isSymptoms);
            setForth(isTrhistory);
            setFifth(isWeekbx);
            if (isWeekbx == 1) {
              setIsHidden(false);
              console.log(333, 'zoule')
              setIsWeekbxOther(isWeekbxOther)
            } else {
              setIsHidden(true);
              setIsWeekbxOther('');
            }
            setEntourageIdCard(entourageIdCard);
            setEntourageName(entourageName);
            setEntourageRelation(entourageRelation);
  }
  const onGoMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: 'wx178fc1457fc06085',
      success: function (res) {

      }
    })
  }
  const $onGoMiniProgram = () => {
    Taro.navigateToMiniProgram({
      appId: 'wx8f446acf8c4a85f5',
      success: function (res) {
      }
    })
  }
  return (
    <View className='container'>
      <View style='display:flex;flex-direction:column;padding-bottom:77PX;'>
        <View className='qrcode-view'>
          <Text className='time'>填写时间：{moment(ctstamp).format('YYYY-MM-DD HH:mm')}</Text>
          <View className='qrcode-wrap'>
            <QRCode
              text={'2222'}
              className='qrcode'
              foregroundColor={foregroundColor}
              backgroundColor={backgroundColor}
              size={180}
              scale={4}
              errorCorrectLevel='L'
              typeNumber={10}
            />
            <Image src={logo} className='img'/>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;'>
        <ListRow style='margin-top:20PX;' disabled={true} value={name} required className='list-row-input' type='text' label='患者姓名'
                 placeholder='请填写真实姓名'/>
        <ListRow disabled={true} value={idCard} required className='list-row-input' type='idcard' label='身份证号'
                 placeholder='请输入身份证号'/>
        <ListRow disabled={true} value={phone} required className='list-row-input1' type='number' label='手机号'
                 placeholder='请填写患者手机号码'/>
        <ListRow disabled={true} value={addrHome} required className='list-row-input' type='text' label='家庭住址'
                 placeholder='请填写住址，详细至门牌号'/>
        <View className='address-info-container'>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
                <Text className='dist-name-text'>人群分类</Text>
                <Text className='select-city-text list-row-input'
                      style={'color:#666'}>{personType}</Text>
              </View>
            </View>
          </View>
        </View>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
                  <Text className='dist-name-text'>22类人群</Text>
                  <Text className='select-city-text list-row-input'
                        style={'color:#666'}>{personType22}</Text>
                </View>
              </View>
            </View>
          </View>
          <View className='address-info-container'>
            <View className='address-info-wrap'>
              <View className='address-info-view'>
                <View style='display:flex;alignItems:center'>
                  <Text style='font-size:14PX;color:red;margin-right:2PX;'>*</Text>
                  <Text className='dist-name-text'>就诊科室</Text>
                  <Text className='select-city-text list-row-input'
                        style={'color:#666'}>{clinicDept}</Text>
                </View>
              </View>
            </View>
          </View>
        {temperature && <View className='list-row-container'>
          <View className='list-row-wrap'>
            <View className='list-row-view  flex-between'>
              <View style='display:flex;flex-direction:row;align-items:center'>
                <Text style='font-size:14PX;color:red;margin-right:2PX;'/>
                <Text className='list-row-text' style='margin-left:7PX;'>当前体温</Text>
              </View>
              <Input type='digit' value={temperature} className='list-row-input' placeholder={'请填写当前体温'}
                     placeholderClass='list-row-input-placeholder'/>
              <View>
                <Text style='font-size:14PX;color:#666'>℃</Text>
              </View>
            </View>
          </View>
        </View>}
        {jobCase&&<View className='address-info-container'>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text style='font-size:14PX;color:red;margin-left:10PX;'/>
                <Text className='dist-name-text'>从业状况</Text>
                <Text className='select-city-text list-row-input'
                      style={'color:#666'}>{jobCase}</Text>
              </View>
            </View>
          </View>
        </View>}
        {entourageName &&
        <ListRow value={entourageName} className='list-row-input' type='text' label='陪同人员' placeholder='请填写陪同人真实姓名'/>}
        {entourageIdCard &&
        <ListRow value={entourageIdCard} className='list-row-input' type='idcard' label='身份证号'
                 placeholder='请输入陪同人身份证号'/>}
        {entourageRelation && <View className='address-info-container'>
          <View className='address-info-wrap'>
            <View className='address-info-view'>
              <View style='display:flex;alignItems:center'>
                <Text className='dist-name-text' style='margin-left:3PX;'>与患者关系</Text>
                <Text className='select-city-text list-row-input2'
                      style={'color:#666'}>{entourageRelation}</Text>
              </View>
            </View>
          </View>
        </View>}
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX' className='notice'>1.发病前14天内是否有病例或无症状感染者报告社区的居住或旅行史？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup>
              <Radio disabled={true} style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1' checked={first == 1 ? true : false}>有</Radio>
              <Radio disabled={true} style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'
                     checked={first == 0 ? true : false}>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX' className='notice'>2.发病前14天内是否与新冠病毒核酸检测/IGg/IGM阳性或无症状感染者有接触史？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup>
              <Radio disabled={true} style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1' checked={second == 1 ? true : false}>有</Radio>
              <Radio disabled={true} style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'
                     checked={second == 0 ? true : false}>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text
              style='color:#333;font-size:14PX'
              className='notice'>3.发病前14天内是否接触过来自新冠肺炎中高风险地区，或境内其他有病例报告的社区，或境外疫情严重国家或地区的发热或有呼吸道症状的患者？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup >
              <Radio disabled={true} style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                      value='1' checked={third == 1 ? true : false}>有</Radio>
              <Radio  disabled={true} style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'
                     checked={third == 0 ? true : false}>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style='display:flex;flex-direction:column;margin-left:20PX;margin-top:10PX;margin-right:20PX'>
          <View style='display:flex;flex-direction:row;'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'
                  className='notice'>4.近14天您所在范围内，如家庭、办公室、学校班级、车间、工地等场所，是否出现2例及以上发热和/或呼吸道症状的病例？</Text>
          </View>
          <View style='margin-top:10PX;'>
            <RadioGroup>
              <Radio disabled={true} style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1' checked={forth == 1 ? true : false}>有</Radio>
              <Radio disabled={true} style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'
                     checked={forth == 0 ? true : false}>无</Radio>
            </RadioGroup>
          </View>
        </View>
        <View style={'display:flex;flex-direction:column;margin-top:10PX;'}>
          <View style='display:flex;flex-direction:row;margin-left:20PX'>
            <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text>
            <Text style='color:#333;font-size:14PX'>5.您2周内有以下表现吗？</Text>
          </View>
          <View style='margin-top:10PX;margin-left:20PX;'>
            <RadioGroup >
              <Radio disabled={true} style={{transform: 'scale(0.8)', marginLeft: '20PX', marginRight: '50PX'}} color='#06B48D'
                     value='1' checked={fifth == 1 ? true : false}>有</Radio>
              <Radio disabled={true} style={{transform: 'scale(0.8)'}} color='#06B48D' value='0'
                     checked={fifth == 0 ? true : false}>无</Radio>
            </RadioGroup>
          </View>
          {(!isHidden) &&
          <View style='margin-top:10PX;display:flex;flex-direction:row;align-items:center;margin-left:10PX;'>
            <RadioGroup>
              <View style='display:flex;'>
                <Radio disabled={true} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                       color='#06B48D'
                       value='1' checked={isWeekbxOther == 1 ? true : false}>发热</Radio>
                <Radio disabled={true} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                       color='#06B48D' value='2' checked={isWeekbxOther == 2 ? true : false}>咳嗽</Radio>
                <Radio disabled={true} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                       color='#06B48D' value='3' checked={isWeekbxOther == 3 ? true : false}>腹泻</Radio>
                <Radio disabled={true} style={{transform: 'scale(0.8)', color: isDisabled ? '#999' : '#333',}}
                       color='#06B48D' value='4' checked={isWeekbxOther == 4 ? true : false}>新冠肺炎其他症状</Radio>
              </View>
            </RadioGroup>
          </View>}
          <View className='list-row-1' onClick={onGoMiniProgram} style='margin-top:10PX'>
            <View className='list-row-wrap'>
              <Text className='title'>河北健康码</Text>
              <Image src={forward} className='img'/>
            </View>
          </View>
          <View className='list-row-1' onClick={$onGoMiniProgram}>
            <View className='list-row-wrap'>
              <Text className='title'>国务院行程码</Text>
              <Image src={forward} className='img'/>
            </View>
          </View>
        </View>
        </View>
      </View>
    </View>
  )
}

const ListRow = (props) => {
  const {label,disabled, placeholder, required, value, style,className, type, onInput} = props;
  return (
    <View className='list-row-container' style={style}>
      <View className='list-row-wrap'>
        <View className='list-row-view'>
          <View style='display:flex;align-items:center'>
            {required ? <Text style='color:red;font-size:14PX;margin-right:2PX;'>*</Text> :
              <View style='margin-right:2PX;'/>}
            <Text className={required ? 'list-row-text' : 'list-row-text1'}>{label}</Text>
          </View>
          <Input type={type} disabled={disabled} value={value} className={className} onInput={onInput} placeholder={placeholder}
                 placeholderClass='list-row-input-placeholder'
          />
        </View>
      </View>
    </View>
  )
}
export default EpidemicResult
