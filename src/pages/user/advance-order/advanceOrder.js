import Taro from '@tarojs/taro'
import {Button, Image, ScrollView, Text, View} from '@tarojs/components'
import {AtModal, AtModalAction, AtTabs, AtTabsPane,} from "taro-ui"
import './advanceOrder.scss'
import {getMyAppointListApi} from "../../../services/user";
import moment from "moment";
import React, {Component} from 'react'
import Api from '../../../config/api';
import * as user from "../../../utils/user";
import Forward from '@assets/home/forward.svg'
import Config from "../../../../project.config.json";
import _Empty from "@assets/empty.png";
import {fetchApplyTradeApi} from "../../../services/combo";
import {throttle} from '../../../utils/common'
import CommunityIcon from '@assets/community-icon.png'
let i = 1;

export class AdvanceOrder extends Component {
  state = {
    current: 0,
    list: [],
    state: '',
    page: 1,
    item: {},
    limit: 100,
    totalPage: 1,
    visible: false,
    isEmpty: false,
    userId: '',
    tabList: [{title: '全部', id: 0}, {title: '预约中', id: 1}, {title: '已预约', id: 2}]
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'我的预约'
    })
  }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中...',
    });
    this._initData();
  }

  _initData = async () => {
    const res = await user.loginByWeixin({appid: Config.appid});
    if (res.code === 200) {
      console.log(333, res);
      const {userId, wxid, unionid, sectionKey} = res.data;
      this.setState({userId}, () => {
        this._getList();
      })
    } else {
      Taro.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
  }

  _getList = () => {
    getMyAppointListApi({
      userId: this.state.userId,
      page: this.state.page,
      size: this.state.limit,
      state: this.state.state
    }).then(res => {
      console.log(444, res);
      if (res.code === 200) {
        if (res.data) {
          const {object, totalPage} = res.data;
          if (Array.isArray(object)) {
            if (object.length > 0) {
              this.setState({isEmpty: false, list: this.state.list.concat(object), totalPage})
            } else {
              this.setState({isEmpty: true})
            }
          } else {
            this.setState({isEmpty: true, list: this.state.list.concat([]), totalPage})
          }
        }
      }
      Taro.hideLoading();
    })

  }

  onReachBottom() {
    if (this.state.totalPage > this.state.page) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this._getList();
      });

    } else {
      Taro.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  }

  handleClick = (value) => {
    let state = '';
    switch (value) {
      case 0:
        state = '';
        break;
      case 1:
        state = 0;
        break;
      case 2:
        state = 1;
        break;
      case 3:
        state = 2;
        break;
      case 4:
        state = 3;
        break;
    }
    console.log(333, value);
    this.setState({current: value, isEmpty: false, state, page: 1, list: []}, () => {
      this._getList();
    })
  }
  goToPage = (item) => {
    if (item.state == 1) {
      Taro.navigateTo({
        url: `/pages/user/order-success/orderAppointSuccess?item=${JSON.stringify(item)}`,
      })
    }
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
  _cancelAppoint = async (item) => {
    this.setState({visible: true, item});
  }
  _deleteAppoint = (item) => {
    this.setState({visible: true, item})
  }
  _enter = () => {
    this.setState({visible: false})
    const {item} = this.state;
    if (item.state == 3) {
      Taro.request({
        url: Api.deleteOrder + `?id=${item.id}`, //仅为示例，并非真实的接口地址
        data: {},
        method: 'DELETE',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          const _res = res.data;
          console.log(222, _res);
          _res.code == 200 && this.setState({page: 1, list: []}, () => {
            this._getList();
          })
        }
      })
    } else if (item.state == 1 || item.state == 0) {
      Taro.showLoading({
        title: '请稍等...',
      });
      Taro.request({
        url: Api.cancelOrder + `?id=${item.id}`, //仅为示例，并非真实的接口地址
        data: {},
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: (res) => {
          console.log(333, res);
          const _res = res.data;
          Taro.hideLoading();
          if (_res.code == 200) {
            if (item.userType == 2) {
              if (item.payState == 1) {
                Taro.navigateTo({url: '/pages/user/refund-pay/refund-payment'})
              }
            }
            this.setState({page: 1, list: []}, () => {
              this._getList();
            })
          } else {
            Taro.showToast({
              title: _res.msg,
              icon: 'none'
            })
          }
        }
      })
    }
  }
  _waitPay = (item) => {
    Taro.request({
      url: Api.createOrder + `?appointId=${item.id}`, //仅为示例，并非真实的接口地址
      data: {},
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (result) => {
        const {code, data} = result.data;
        if (code == 200) {
          fetchApplyTradeApi({
            payType: '02',
            orderId: data
          }).then(response => {
            // appId: "wx99bc91f0ade99f16"
            // nonceStr: "mygY7r2Ac0pyI6XL"
            // packageValue: "prepay_id=wx17140433899831f06b0a174a946b0a0000"
            // paySign: "9B50AD71302BEB2F6DC9190C3F743F5C"
            // signType: "MD5"
            // timeStamp: "1610863474"
            if (response.code == 200) {
              const {
                payResult: {timeStamp, paySign, nonceStr, appId, signType, packageValue},
              } = response.data;
              Taro.requestPayment({
                appId,
                timeStamp,
                nonceStr,
                package: packageValue,
                signType,
                paySign,
                success: function (result) {
                  // _this._getList();
                  // Taro.navigateTo({
                  //   url: `/pages/user/payment-success/payment-success?id=${item.id}`
                  // })
                  Taro.navigateTo({
                    url: `/subPackages/pages/user/appoint-wait/appoint-wait?id=${item.id}`
                  })
                },
                fail: function (res) {
                  Taro.showToast({
                    title: '支付失败',
                    icon: 'none',
                  })
                }
              })
            }
          }).catch(error => {
            console.log(333, error);
          })
        } else {
          Taro.showToast({
            title: '交易失败',
            icon: 'none',
          })
        }
        // const _res = res.data;
        // _res.code == 200 && this.setState({visible: false, page: 1, list: []}, () => {
        //   this._getList();
        // })
      }
    })
  }

  render() {
    const {current, tabList, isEmpty, list, visible, item: tipItem} = this.state;
    return (
      <ScrollView scrollY className='container'>
        <View className='main'>
          <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
            {tabList.map((item, index) => {
              return (
                <AtTabsPane key={item.id + ""} current={current} index={index}>
                  {!isEmpty ? list.map((_item, index) => {
                    let date = moment(_item.date).format('YYYY-MM-DD');
                    let week = this._getWeek(_item.date);
                    return (
                      <View className='wrap' key={_item.id + " "}>
                        <View className='main'>
                          <View className='listItem'>
                            <View className='listItem_left'>
                              <View style='display:flex;flex-direction:row;align-items:center'>
                                <Text className='listItem_left_appoint'>预约人:{_item.name}</Text>
                                {_item.communityFlag==1&&<Image src={CommunityIcon} style='margin-left:5PX; width:43PX;height:22PX'/>}
                              </View>
                              <Text
                                className='listItem_left_date'>{date} {week} {_item.timeType == 0 ? '上午' : _item.timeType == 1 ? '下午' : '全天'}</Text>
                            </View>
                            <View className='listItem_right' onClick={(item) => this.goToPage(_item)}>
                              <Text
                                className='listItem_right_status'
                                style={_item.state == 0 ? 'color:red' : _item.state == 1 ? 'color:green' : _item.state == 2 ? '#333' : '#999'}>{_item.state == 0 ? '预约中' : _item.state == 1 ? '已预约' : _item.state == 2 ? '已完成' : '已取消'}</Text>
                              {(_item.state != 3 || _item.state != 0) &&
                              <Image src={Forward} className='listItem_right_arrow'/>}
                            </View>
                          </View>
                          <View className='foot'>
                            {(_item.state == 0 || _item.state == 1) &&
                            <View className='op_btn_1' onClick={() => throttle(this._cancelAppoint(_item), 3000)}>
                              <Text style={'margin:auto;'}>取消预约</Text>
                            </View>}
                            {(_item.state == 0 && _item.userType == 2) &&
                            <View className='op_btn_2' style={'border-color:red;border-width:1px;border-style:solid'}
                                  onClick={() => this._waitPay(_item)}>
                              <Text style={'color:red;margin:auto;'}>待支付</Text>
                            </View>}
                            {_item.state == 3 &&
                            <View className='op_btn_2' onClick={() => this._deleteAppoint(_item)}>
                              <Text style={'margin:auto;'}>删除</Text>
                            </View>}
                          </View>
                        </View>
                      </View>
                    )
                  }) : <Empty/>}
                </AtTabsPane>)
            })}
          </AtTabs>
        </View>
        <AtModal
          closeOnClickOverlay={false}
          isOpened={visible}
        >
          <View className='modal-view'>
            <Text className='modal-text'>确定{tipItem.state == 3 ? '删除' : '取消'}该条预约信息吗？</Text>
          </View>
          <AtModalAction>
            <Button className={'btn'} onClick={() => this.setState({visible: false})}>取消</Button>
            <Button onClick={this._enter}>确定</Button>
          </AtModalAction>
        </AtModal>
      </ScrollView>
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
export default AdvanceOrder
