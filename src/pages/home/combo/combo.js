import Taro from '@tarojs/taro'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import './combo.scss'
import React, {Component} from "react";
import {getCurrentInstance} from "@tarojs/runtime";
import {fetchSourceApi, queryComboListByOrgApi} from "../../../services/combo";
import moment from 'moment';
import Api from '../../../config/api'
import Clock from '@assets/clock.png';
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import {callGetEmployeeInfoApi} from "../../../services/home";

let max = 13;

class Combo extends Component {
  state = {
    scrollTop: 0,
    threshold: 20,
    orgId: '',
    item: {},
    dateArr: [],
    comboList: [],
    comboId: '',
    userType: '',
    startDate: '',
    endDate: '',
    visible: false,
    orgName: '',
    sourceList: [],
    price: 0,
    employeeInfo: {},
    flag: false,
    isScroll: true,
    openDoctorFree: true,
    imgUrl: '',
  }

  componentWillMount() {
    Taro.setNavigationBarTitle({
      title: '立即预约'
    })
  }

  componentDidMount() {
    let {orgId, item, userType} = getCurrentInstance().router.params;
    const {orgName, url} = JSON.parse(item);
    console.log(333,Api.imgUrl+url);
    this.setState({orgId, userType, orgName, imgUrl: url?Api.imgUrl + url + "?t=3":'', item: JSON.parse(item)}, () => {

      this._initData(this.state.orgId);

    })

  }

  _getWeek = (date) => {
    let week = moment(date).day()
    switch (week) {
      case 0:
        return '周日';
      case 1:
        return '周一';
      case 2:
        return '周二';
      case 3:
        return '周三';
      case 4:
        return '周四';
      case 5:
        return '周五';
      case 6:
        return '周六'
    }
  }
  _initData = async (orgId) => {
    Taro.showLoading({
      title: '加载中...',
    });
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment().add('days', max).format('YYYY-MM-DD');
    let dateArr = [];
    for (let i = 0; i <= max; i++) {
      let date = moment().add('days', i).format('YYYY-MM-DD');
      let week = this._getWeek(date);
      if (i === 0) {

        dateArr.push({
          id: i,
          date,
          week: '今天',
          amount: 0,
          comboId: '',
          orgId: '',
          sourceId: '',
          // surplus:-1 ,
          checked: true,
        })
      } else {
        dateArr.push({
          id: i,
          date,
          week,
          amount: 0,
          comboId: '',
          orgId: '',
          sourceId: '',
          // surplus: -1,
          checked: false,
        })
      }
    }
    const _res = await user.loginByWeixin({appid: Config.appid});
    console.log(123456, _res);
    if (_res.code === 200) {
      const {userId, wxid, unionid, sectionKey} = _res.data;
      const result = await callGetEmployeeInfoApi(userId);
      console.log(333, result);
      if (result.data) {
        const res = await queryComboListByOrgApi({
          orgId
        })
        console.log(666, res);
        if (res.code === 200) {
          if (Array.isArray(res.data)) {
            let data = [];
            if (this.state.openDoctorFree) {
              data = res.data.filter(item => item.comboId == 4);
            } else {
              data = res.data.filter(item => item.comboId != 4);
            }
            data.map((item, index) => {
              index === 0 ? item.checked = true : item.checked = false;
            })
            // let _data = res.data.filter(item=>item.comboId==1);
            this.setState({
              employeeInfo: result.data,
              comboList: data,
              price: data[0].price,
              comboName: data[0].name,
              comboId: data[0].comboId,
              dateArr: [...dateArr]
            }, () => {
              this._getSource(data[0].comboId, startDate, endDate);
            })
          }
        }
      } else {
        const res = await queryComboListByOrgApi({
          orgId
        })
        console.log(666, res);
        if (res.code === 200) {
          if (Array.isArray(res.data)) {
            let data = res.data.filter(item => item.comboId != 4);
            data.map((item, index) => {
              index === 0 ? item.checked = true : item.checked = false;
            })
            // let _data = res.data.filter(item=>item.comboId==1);
            this.setState({
              employeeInfo: {},
              comboList: data,
              price: data[0].price,
              comboName: data[0].name,
              comboId: data[0].comboId,
              dateArr: [...dateArr]
            }, () => {
              this._getSource(data[0].comboId, startDate, endDate);
            })
          }
        }

      }
    }

  }
  /**
   * 初始化获取号源
   * @param comboId
   * @param startDate
   * @param endDate
   * @returns {Promise<void>}
   * @private
   */
  _getSource = async (comboId, startDate, endDate) => {
    if (comboId) {
      const _res = await fetchSourceApi({
        comboId,
        startDate,
        endDate
      })
      const {dateArr} = this.state;
      if (_res.code === 200) {
        if (_res.data.length !== 0) {
          _res.data.map(_item => {
            dateArr.map(item => {
              let date = moment(_item.date).format('YYYY-MM-DD');
              if (item.date === date) {
                item.amount = _item.amount;
                item.surplus = _item.surplus;
                item.comboId = _item.comboId;
                item.orgId = _item.orgId;
                item.sourceId = _item.sourceId;
                // _item.surplus>0?item.checked=true:item.checked = false;
              }
            })
          })
        }

        this.setState({flag: true, comboId, dateArr: [...dateArr], sourceList: _res.data, startDate, endDate}, () => {
          console.log(999, this.state.dateArr);
          let timer = setTimeout(() => {
            this.setState({isScroll: true}, () => {
              clearTimeout(timer);
            })
          }, 100)
        })
      }
    } else {
      this._initData(this.state.orgId);
    }
    Taro.hideLoading();
  }
  onScrollToUpper = () => {

  }
  _selectedSource = (item) => {
    this.state.dateArr.map((_item, index) => {
      _item.checked = false;
      if (JSON.stringify(item) === JSON.stringify(_item)) {

        _item.checked = true;

      }
    })
    this.setState({isScroll: false, dateArr: [...this.state.dateArr]}, () => {
      this._getSource(this.state.comboId, item.date, item.date);
    })
  }
  onScroll = (event) => {
    console.log(333, event);
  }
  /**
   * 选择套餐
   * @param item
   * @private
   */
  _selectedCombo = (item) => {
    this.state.comboList.map((_item, index) => {
      _item.checked = false;
      if (JSON.stringify(item) === JSON.stringify(_item)) {

        _item.checked = true;

      }
    })
    this.setState({
      isScroll: false,
      comboName: item.name,
      price: item.price,
      comboList: [...this.state.comboList]
    }, () => {
      this._getSource(item.comboId, this.state.startDate, this.state.endDate);
    })

  }
  /**
   * 下一步
   * @private
   */
  _nextStep = (item) => {
    let date = new Date();
    let _date = moment(item.date).format('YYYY-MM-DD');
    let _date_ = moment(date).format('YYYY-MM-DD')
    let hour = date.getHours()+date.getMinutes()/60;
    if(this.state.comboId==5||this.state.comboId==7) {
      if (item.timeType === 0) {
        if ((item.surplus > 0 && (_date == _date_ && hour <= 12)) || (item.surplus > 0 && _date !== _date_)) {
          this._skip(item);
        }
      } else {
        if ((item.surplus > 0 && (_date == _date_ && hour <= 24) || (item.surplus > 0 && _date !== _date_))) {
          this._skip(item);
        }
      }
    }else{
      if (item.timeType === 0) {
        if ((item.surplus > 0 && (_date == _date_ && hour <= 12)) || (item.surplus > 0 && _date !== _date_)) {
          this._skip(item);
        }
      } else {
        if ((item.surplus > 0 && (_date == _date_ && hour <= 17.5) || (item.surplus > 0 && _date !== _date_))) {
          this._skip(item);
        }
      }
    }

  }
  _skip = (item) => {
    const {userType, employeeInfo, orgName, comboName,} = this.state;
    let source = {comboId: this.state.comboId, comboName, ...item, orgName, price: this.state.price}
    userType == 1 && Taro.navigateTo({
      url: `/pages/home/write-person-info/addPersonData?item=${JSON.stringify(source)}`
    })
    if (userType == 2) {
      if (Object.keys(employeeInfo).length == 0) {
        Taro.navigateTo({
          url: `/pages/home/choice-patient/index?item=${JSON.stringify(source)}`
        })
      } else {
        let item = {
          ...source, ...item, ...employeeInfo, docUrl: '',
          patientId: '', jobId: '',
          payType: 0,
          entourageIdCard: '',
          entourageName: '',
          entouragePhone: '',
          entourageRelation: ''
        };
        console.log(333, item)
        Taro.navigateTo({
          url: `/pages/home/confirm/confirm?item=${JSON.stringify(item)}&userType=1`
        })
      }
    }
  }

  render() {
    const {dateArr, isScroll, flag, comboList, startDate, sourceList, item} = this.state;
    let _item = {};
    let _sourceList = sourceList && sourceList.filter(item => moment(item.date).format('YYYY-MM-DD') === startDate);
    // console.log(333,_sourceList);
    if (_sourceList.length == 2) {
      for (let i = 0; i < _sourceList.length; i++) {
        if (_sourceList[i].timeType === 0) {
          _item = _sourceList[i];
          _sourceList.splice(i, 1);
          break;
        }
      }
      _sourceList.unshift(_item);
    }

    return (
      <View className='container-box'>
        <View className='main'>
          <View className='list-row-container' key={item.orgId + " "}>
            <View className='list-row-view'>
              <Image src={this.state.imgUrl} className='hospital-img'/>
              <View className='hospital-info-view'>
                <Text
                  className='hospital-title'>{item.orgName && item.orgName.length > 10 ? item.orgName.substring(0, 10) + "..." : item.orgName}</Text>
                <Text className='hospital-subtitle'>核酸检测预约中心</Text>
                <Text className='hospital-address'>地址：{item.wholeAddress}</Text>
              </View>
            </View>
          </View>
          <View className='order-time-view'>
            <Text className='order-time'>预约时间</Text>
          </View>
          <View className='section'>
            <ScrollView
              className='scrollView'
              scrollX={isScroll}
              scrollWithAnimation
              scrollTop={this.state.scrollTop}
              // style={scrollStyle}
              lowerThreshold={this.state.threshold}
              upperThreshold={this.state.threshold}
              onScrollToUpper={this.onScrollToUpper} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
              onScroll={this.onScroll}
            >
              {flag && dateArr.map((item, index) => {
                let month_day = moment(item.date).format('MM-DD');
                return (
                  <View className='wrap' key={item.id + " "} onClick={() => this._selectedSource(item)}>
                    <View className='wrap_content'
                          style={item.checked ? 'background-color:rgba(51, 153, 255, 0.698039215686274)' : 'background-color:white'}>
                      <Text className='wrap_content_week'
                            style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color: #222222;' : 'color:#333'}>{item.week}</Text>
                      <Text className='wrap_content_date'
                            style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color:#222222' : 'color:#666'}>{month_day}</Text>
                      <Text className='wrap_content_status'
                            style={item.checked ? 'color: #fff' : item.surplus > 0 ? 'color: #3299FF' : 'color:#999'}>
                        {item.surplus > 0 ? '有号' : '无号'}
                      </Text>
                    </View>
                  </View>

                )
              })}
            </ScrollView>
          </View>
          <View className='combo-choice-view'>
            <Text className='combo-choice-text'>套餐选择</Text>
          </View>
          {comboList.length !== 0 && comboList.map((item, index) => {
            return (
              <View className='combo-list' style={item.checked ? 'border:1PX solid #3299FF' : 'border-width:0'}
                    key={item.comboId + " "} onClick={() => this._selectedCombo(item)}>
                <View className='combo-wrap'>
                  <View style='display:flex;flex-direction:column;'>
                    <Text className='title'>{item.name}</Text>
                    <Text className='content'>套餐内容：{item.desc}</Text>
                    <View style='display:flex;flex-direction:row;align-items:center;'>
                      <Text className='price'>￥{item.price}</Text>

                      <Text className='price'
                            style='margin-left:15PX;'>{item.comboId == 1 ? '12小时出结果' : item.comboId == 2 ? '24小时出结果' : ''}</Text>
                    </View>
                  </View>
                  <View className='choice-view'>
                    <View className='choice-wrap'
                          style={item.checked ? 'background: #3299FF' : 'background:transparent'}>
                    </View>
                  </View>
                </View>
              </View>
            )
          })}
          {_sourceList.length !== 0 && _sourceList.map(item => {
            let date = new Date();
            let _date = moment(item.date).format('YYYY-MM-DD');
            let _date_ = moment(date).format('YYYY-MM-DD')
            let  hour  = date.getHours()+date.getMinutes()/60;
            return (
              <View className='list-row' key={item.sourceId + " "}>
                <View className='list-row-wrap'>
                  <View style='display:flex;flex-direction:row;align-items:center'>
                    <Image src={Clock} className='clock-img'/>
                    {/*<Text className='time-text'>{item.timeType === 0 ? '上午' : item.timeType === 1 ? '下午' : '全天'}</Text>*/}
                    {(this.state.comboId == 5 || this.state.comboId == 7) &&
                    <Text className='time-range-text'>{item.timeType === 0 ? '0:00～12:00' : '12:00～24:00'}</Text>}
                    {(this.state.comboId == 6 ||this.state.comboId ==4)&&
                    <Text className='time-range-text'>{item.timeType === 0 ? '08:00～12:00' : '12:00～17:30'}</Text>}
                  </View>
                  <View style='display:flex;flex-direction:row;align-items:center'>
                    <Text className='sy-text'>剩余：</Text>
                    <Text className='surplus--text'>{item.surplus}</Text>
                  </View>
                  {(this.state.comboId == 5 || this.state.comboId == 7) && <View className='right-away-order-view'
                                                                               style={item.timeType === 0 ? ((item.surplus > 0 && (_date == _date_ && hour <= 12))
                                                                                 || (item.surplus > 0 && _date !== _date_)) ? 'background-color:#3299FF' : 'background: #DDDDDD' : ((item.surplus > 0 && (_date == _date_ && hour <= 24))
                                                                                 || (item.surplus > 0 && _date !== _date_)) ? 'background-color:#3299FF' : 'background: #DDDDDD'}
                                                                               onClick={() => this._nextStep(item)}>
                    <Text className='right-away-order-text'>立即预约</Text>
                  </View>}
                  {(this.state.comboId == 6 || this.state.comboId ==4) && <View className='right-away-order-view'
                                                   style={item.timeType === 0 ? ((item.surplus > 0 && (_date == _date_ && hour <= 12))
                                                     || (item.surplus > 0 && _date !== _date_)) ? 'background-color:#3299FF' : 'background: #DDDDDD' : ((item.surplus > 0 && (_date == _date_ && hour <= 17.5))
                                                     || (item.surplus > 0 && _date !== _date_)) ? 'background-color:#3299FF' : 'background: #DDDDDD'}
                                                   onClick={() => this._nextStep(item)}>
                    <Text className='right-away-order-text'>立即预约</Text>
                  </View>}
                </View>
              </View>)
          })}
        </View>
      </View>
    )
  }
}

export default Combo
