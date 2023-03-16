import {Button, Image, Radio, Text, View} from "@tarojs/components";
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
import {callCheckEpidemicSurveyApi, callGetEmployeeInfoApi} from "../../../services/home";
import moment from 'moment'
import {callDeletePatientApi, callGetEpidemicInfoListApi, callGetPatientInfoListApi} from "../../../services/SyncRequest";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import Forward from '@assets/home/forward.svg';
import {desensitizationIdCard} from "../../../utils/common";
export default class choicePatient extends PureComponent {
  constructor() {
    super();
    this.state = {
      epidemicList:[],
      isEmpty:false,
      hasMore:true,
      page:1,
      pageSize:10,
    }
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'流调结果'
    })
  }

  componentDidMount() {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    this.setState({
      isIphoneX
    }, () => {
      this.initData();
    })
  }
  onAppointConfirm=async (item)=>{
    Taro.navigateTo({
      url:`/pages/user/epidemic-result/index?item=${JSON.stringify(item)}`
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
      const res = await callGetEpidemicInfoListApi({
        userId,
        date:moment().format('YYYY-MM-DD'),
        page:this.state.page,
        size:this.state.pageSize,
      })
      if(res.code ==200){
        let tempArray = this.state.epidemicList;
        if (this.state.page == 1) {
          tempArray = []
        }
        let contentList = res.data.object;
        if(Array.isArray(contentList)) {
          if (this.state.page >= res.data.currentPage) {
            this.setState({
              epidemicList: tempArray.concat(contentList),
              hasMore: false,
              isEmpty:false,
            })
          } else {
            this.setState({
              epidemicList: tempArray.concat(contentList),
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
  render() {
    const {isIphoneX,epidemicList} = this.state;
    return (
      <View className='container'>
        <View className='list'>
          {!this.state.isEmpty? epidemicList.map((item, index) => {
            return (
              <View className='list-row'  onClick={() =>this.onAppointConfirm(item)}>
                <View className='list-row-wrap'>
                  <View className='left'>
                    <View className='top'>
                      <Text className='name'>{item.patientName}</Text>
                      <Text className='age'>{desensitizationIdCard(item.idCard)}</Text>
                      {/*<AtTag size='small' circle className='tag'>{item.relation}</AtTag>*/}
                    </View>
                    <View className='idcard'>
                      {/*<Text>身份证号</Text>*/}
                      <Text className='idcard-value'>{moment(item.sheetDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
                    </View>
                  </View>
                  <Image src={Forward} className='forward'/>
                </View>
              </View>

            )
          }):<Empty/>}
        </View>
      </View>
    )
  }
}
