import Taro,{Events} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'
import Order from '@assets/order.png';
import Audit from '@assets/audit.png';
import ArrowRight from '@assets/home/forward.svg'
import Employee from '@assets/employee.svg'
import './user.scss'
import DefaultAvatar from '@assets/ucenter/avatar.png'
import Result from '@assets/result.svg'
import Manager from '@assets/manager.svg';
import React, {useState, useEffect, Component} from 'react'
class User  extends Component {
  constructor() {
    super();
    this.state = {
      userInfo:null,
      listItems: [
        {label: '审核记录', id: 0, img:Order, onPress: () => this._goToAuditRecord()},
        {label: '我的预约', id: 1, img:Audit, onPress: () => this.goToAdvanceOrder()},
        {label: '员工通道', id: 2, img:Employee, onPress: () => this._insertEmployeeInfo()},
        {label: '流调查询',id:2,img:Result,onPress:()=>this._getEpidemicResult()},
        {label: '就诊人管理', id: 2, img:Manager, onPress: () => this.onPatientManage()},
      ]
    }
  }
  componentDidMount() {
    Taro.setNavigationBarTitle({
      title:'我的'
    })
    const userInfo = Taro.getStorageSync('userInfo')
     this.setState({userInfo});
  }
  goToAdvanceOrder = () => {
    if(this.state.userInfo){
      Taro.navigateTo({
        url: '/pages/user/advance-order/advanceOrder',
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }

  }
  _insertEmployeeInfo=()=>{
    if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/user/employee-info/index'
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }
  }
  _goToAuditRecord=()=>{
    if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/user/audit-record/auditRecord'
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }

  }
  onPatientManage=()=>{
    if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/user/choice-patient/index'
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }
  }
  _getEpidemicResult=()=>{
    if(this.state.userInfo){
      Taro.navigateTo({
        url:'/pages/user/epidemic-patient-list/index'
      })
    }else{
      Taro.navigateTo({
        url:'/pages/auth/login/login'
      })
    }
  }
  render() {
    const {hasLogin,listItems,userInfo}= this.state;
    return (
      <View className='container'>
        <View className='user-header'>
          <View className='user-header_wrap' >
            <View className='user-header_wrap_avatar'>
              <open-data type="userAvatarUrl"></open-data>
            </View>
            <View className='user-header_wrap_username'>
              <open-data type='userNickName'></open-data>
            </View>
          </View>
        </View>
        {listItems.map((item, index) => {
          return (
            <View className='section' key={item.id + ""} onClick={item.onPress}>
              <View className='section_wrap'>
                <View className='section_wrap_left'>
                  <Image src={item.img} className='section_wrap_left_list'/>
                  <Text className='section_wrap_left_title'>{item.label}</Text>
                </View>
                <Image src={ArrowRight} className='section_wrap_right'/>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

}
export default User
