import {Button, Radio, Text, View} from "@tarojs/components";
import React, {PureComponent, useEffect, useLayoutEffect, useState} from "react";
import Taro from '@tarojs/taro'
import './index.scss'
import {AtModal, AtModalAction, AtModalContent, AtModalHeader, AtSwipeAction, AtTag} from "taro-ui";
// import {
//   callCanAppointOrgApi,
//   callCheckIsCanAppoint,
//   callGetRecipientListApi
// } from "../../../services/SyncRequest";
import {getCurrentInstance} from "@tarojs/runtime";
import Empty from "@components/empty";
import {callCheckEpidemicSurveyApi} from "../../../services/home";
import moment from 'moment'
import {callDeletePatientApi, callGetPatientInfoListApi} from "../../../services/SyncRequest";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
export default class InvestChoicePatient extends PureComponent {
  constructor() {
    super();
    this.state = {
      patientList:[],
      isEmpty:false,
      hasMore:true,
      page:1,
      pageSize:10,
    }
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'选择预约人'
    })
  }

  componentDidMount() {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    this.setState({
      isIphoneX
    }, () => {
      this.initData();
    })
    Taro.eventCenter.on('updatePatientList', res => {
      this.setState({
        page:1,
        pageSize:10
      },()=>{
        this.initData();
      })
    })
  }
  componentWillUnmount() {
    Taro.eventCenter.off('updatePatientList');
  }
  onAppointConfirm=async (item)=>{
    // Taro.navigateTo({
    //   url:`/pages/home/epidemic-survey/index?item=${JSON.stringify(item)}`
    // })
    Taro.eventCenter.trigger('appoint-info',item);
    Taro.navigateBack({
      delta:1
    })
  }
  onReachBottom(){
    if (this.state.hasMore) {
       this.initData();
    } else {
      Taro.showToast({
        title: '没有更多数据',
        icon:'none',
        duration:3500,
        mask:true
      })
    }
  }
/**
 * 页面上拉触底事件的处理函数
 */

initData = async () => {
    const _res = await user.loginByWeixin({appid: Config.appid});
    console.log(123456, _res);
    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;
      const res = await callGetPatientInfoListApi({
        userId,
        page:this.state.page,
        size:this.state.pageSize,
      })
      if(res.code ==200){
        let tempArray = this.state.patientList;
        if (this.state.page == 1) {
          tempArray = []
        }
        let contentList = res.data.object;
        if(Array.isArray(contentList)) {
          if (this.state.page >= res.data.currentPage) {
            this.setState({
              patientList: tempArray.concat(contentList),
              hasMore: false,
              isEmpty:false,
            })
          } else {
            this.setState({
              patientList: tempArray.concat(contentList),
              hasMore: true,
              pageNum: this.data.page + 1,
              isEmpty:false
            })
          }
        }else {
          this.setState({
            isEmpty:true
          })
        }
      }else {
        this.setState({
          isEmpty:true
        })
      }

    }
  }

  addPatient = () => {
      Taro.navigateTo({
        url: '/pages/home/add-patient-info/index'
      })
    }
  handleSingle=(e)=>{
      console.log(12,e)
  }
  render() {
    const {isIphoneX,patientList} = this.state;
    return (
      <View className='container'>
        <View className='list'>
          {!this.state.isEmpty? patientList.map((item, index) => {
            return (
              <View className='list-row' onClick={() =>this.onAppointConfirm(item)}>
                <View className='list-row-wrap'>
                  <View className='left'>
                    <View className='top'>
                      <Text className='name'>{item.name}</Text>
                      {/*<Text className='age'>{age}岁</Text>*/}
                      <AtTag size='small' circle className='tag'>{item.relation}</AtTag>
                    </View>
                    <View className='idcard'>
                      <Text>身份证号</Text>
                      <Text className='idcard-value'>{item.idCard}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          }):<Empty/>}
        </View>

        <View className='footer'>
          <View className='btn-submit-view' style={isIphoneX ? 'margin-bottom:34rpx' : 'margin-bottom:0rpx'}
                onClick={this.addPatient}>
            <Text className='btn-submit-text'>+ 添加就诊人</Text>
          </View>
        </View>
      </View>
    )
  }
}
