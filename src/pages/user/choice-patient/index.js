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
import {callCheckEpidemicSurveyApi} from "../../../services/home";
import moment from 'moment'
import {callDeletePatientApi, callGetPatientInfoListApi} from "../../../services/SyncRequest";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import Edit from '@assets/edit.svg';
export default class ChoicePatient extends PureComponent {
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
      title:'就诊人管理'
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
  onDeletePatient=async (personId)=>{
    const res = await  callDeletePatientApi({
      personId
    })
    if(res.code==200){
      this.setState({
        page:1,
        size:10
      })
      this.initData();
    }
  }
  $onDeletePatient =async (id)=>{
    let self = this;
    Taro.showModal({
      title: '温馨提示',
      confirmColor: '#3991fa',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          self.onDeletePatient(id);
        }
      }
    })
  }
  _updatePatientInfo=(item)=>{
     Taro.navigateTo({
       url:`/pages/user/update-patient-info/index?personId=${item.personId}`
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
              <AtSwipeAction
                key={item.personId+""}
                className={'swipe'}
                onOpened={this.handleSingle}
                isOpened={false}
                onClick={()=>this.onDeletePatient(item.personId)}
                options={[
                  {
                    text: '删除',
                    style: {
                      color:'#fff',
                      backgroundColor: 'red'
                    }
                  }
                ]}
              >
              <View className='list-row' onLongPress={()=>this.$onDeletePatient(item.personId)} >
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
                  <View className='edit-view' onClick={()=>this._updatePatientInfo(item)}>
                      <Image src={Edit} className='img'/>
                      <Text className='txt-edit'>编辑</Text>
                  </View>
                </View>
              </View>
              </AtSwipeAction>
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
