import Taro from '@tarojs/taro'
import {View, Text, Image, Input} from '@tarojs/components'
import Marker from '@assets/home/location.png';
import Api from '../../../config/api'
import './organization.scss'
import React, { Component } from 'react'
import {getQueryOrgListByNameApi} from "../../../services/home";
import {getCurrentInstance} from "@tarojs/runtime";
import Search from '@assets/search.png'
import _Empty from "@assets/empty.png";
class Organization extends Component {
  state={
    queryName:'',
    city:'北京',
    list:[],
    isEmpty:false,
  }
  componentDidMount() {
    Taro.showLoading({
      title: '加载中...',
    });
      // this._getAuthorize();
      this._getList();
  }
  _getAuthorize=()=>{
    let _this =this;
    Taro.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({
            scope: 'scope.userLocation',
            success: function () {
              _this._getLocation();
            }
          })
        }else{
          _this._getLocation();
        }
      }
    })
  }
  _getLocation=()=>{
    // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
    // Taro.getLocation({
    //   type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
    //   success: function (res) {
    //     const latitude = res.latitude
    //     const longitude = res.longitude
    //     console.log(222,res);
    //     //下载qqmap-wx-jssdk,然后引入其中的js文件
    //     let qqmapsdk = new QQMapWX({
    //       key: '4HCBZ-ERO6U-AQTVJ-BMVJH-FCJI6-WFB2T'// 必填
    //     });
    //
    //     //逆地址解析,通过经纬度获取位置等信息
    //     qqmapsdk.reverseGeocoder({
    //       location:{latitude,longitude},
    //       success: (res) =>{
    //         console.log(888,res);
    //         // 获取当前城市
    //         this.setState({city:res.result.address_component.city});
    //       },
    //       fail:function (res){
    //         console.log(333,'走了');
    //       }
    //     })
    //   }
    // })
  }
  _getList =()=>{
    getQueryOrgListByNameApi({
      queryName:this.state.queryName,
      provName:'北京',
    }).then(res => {
      console.log(444,res);
      if(Array.isArray(res)){
        if(res.length>0){
          this.setState({isEmpty:false,list:res})
        }else{
          this.setState({isEmpty:true})
        }
      }
      Taro.hideLoading();
    })

  }
  goToCombo = (item) => {
    const {userType,obj} =getCurrentInstance().router.params;
    console.log(333,obj);
    if(obj){
      let obj =JSON.parse(obj);
      Taro.navigateTo({
        url: `/pages/home/combo/combo?userType=${userType}&orgId=${item.orgId}&item=${JSON.stringify(item)}&obj=${JSON.stringify(obj)}`
      })
    }else{
      Taro.navigateTo({
        url: `/pages/home/combo/combo?userType=${userType}&orgId=${item.orgId}&item=${JSON.stringify(item)}`
      })
    }

  }
    render(){
      // orgCode: "JMQZ100001030"
      // orgId: "731564657587781632"
      // orgName: "体检医院"
      // orgType: "350200201913000001"

      const {list,city,isEmpty} = this.state;
      return (
        <View className='container'>
          <View className='main'>
              <View className='search-view'>
                  <View className='search-wrap'>
                    <View style='display:flex;flex-direction:row;align-items:center'>
                      <Image src={Marker} className='marker-img'/>
                      <Text className='city-text'>{city}</Text>
                    </View>
                    <View className='search-bar'>
                      <Image src={Search} className='search-img'/>
                      <Input placeholder='搜索'  placeholderClass='search-input' onInput={(e)=>{
                        this.setState({
                          queryName:e.detail.value
                        },()=>{
                          this._getList();
                        })
                      }}/>
                    </View>
                  </View>
              </View>
            {!isEmpty?list.map((item,index)=>{
              return(
                <View className='list-row-container' onClick={()=>this.goToCombo(item)} key={item.orgId+" "}>
                  <View className='list-row-view'>
                    <Image src={Api.imgUrl+item.url} className='hospital-img'/>
                    <View className='hospital-info-view'>
                      <Text className='hospital-title'>{item.orgName.length>10?item.orgName.substring(0,10)+"...":item.orgName}</Text>
                      <Text className='hospital-subtitle'>核酸检测预约中心</Text>
                      <Text className='hospital-address'>地址：{item.wholeAddress}</Text>
                    </View>
                  </View>
                </View>
              )
            }):<Empty/>}
          </View>
        </View>

      )
    }
  }
const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={_Empty} className='empty-img'/>
        <Text className='empty-text'>暂无预约信息哦~</Text>
      </View>
    </View>
  )
}
export default Organization
