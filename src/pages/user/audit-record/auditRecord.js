import Taro from '@tarojs/taro'
import {Image, ScrollView, Text, View} from '@tarojs/components'
import VirtualList from '@tarojs/components/virtual-list'
import {AtTabs, AtTabsPane,} from "taro-ui"
import './auditRecord.scss'
import {getAuditRecordApi} from "../../../services/user";
import moment from "moment";
import React, {Component} from 'react'
import * as user from "../../../utils/user";
import Forward from '@assets/home/forward.svg';
import Config from "../../../../project.config.json";
import _Empty from "@assets/empty.png";
import {isEmpty} from "../../../utils/EmptyUtil";
export class AuditRecord extends Component {
  state = {
    current: 0,
    list: [],
    state: '',
    page: 1,
    isEmpty:false,
    limit: 100,
    totalPage: 1,
    userId: '',
    tabList: [{title: '全部', id: 0}, {title: '审核中', id: 1}, {title: '已通过', id: 2}, {title: '已驳回', id: 3}]
  }

  componentDidMount() {
    Taro.showLoading({
      title: '加载中...',
    });
    this._initData();
  }
  componentWillMount() {
    Taro.setNavigationBarTitle({
      title:'我的审核'
    })

  }

  _initData = async () => {
    const res = await user.loginByWeixin({appid: Config.appid});
    if (res.code === 200) {
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
    getAuditRecordApi({
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
            if(object.length>0) {
              this.setState({isEmpty:false,list: this.state.list.concat(object), totalPage})
            }else{
              this.setState({isEmpty:true})
            }
          } else {
            this.setState({isEmpty:true,list: this.state.list.concat([]), totalPage})
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
    }
    this.setState({ current: value,isEmpty:false, state, page: 1, list: [] }, () => {
      this._getList();
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
  goToPage = (item) => {
    console.log(333,item);
    Taro.navigateTo({
      url:`/pages/home/audit-detail/audit-detail?item=${JSON.stringify(item)}`
    })

  }

  render() {
    const {current, tabList,isEmpty, list} = this.state;
    console.log(333, list);
    return (
      <ScrollView scrollY className='container'>
        <View className='container_body'>
          <AtTabs current={current} tabList={tabList} onClick={this.handleClick}>
            {tabList.map((item, index) => {
              return (
                <AtTabsPane key={item.id + ""} current={current} index={index}>
                  {!isEmpty? list.map((_item, index) => {
                    let date = moment(_item.date).format('YYYY-MM-DD');
                    let week = this._getWeek(_item.date);
                    return (
                      <View className='wrap' key={_item.id + " "} onClick={() => this.goToPage(_item)}>
                        <View className='main'>
                          <View className='listItem'>
                            <View className='listItem_left'>
                              <Text className='listItem_left_appoint'>预约人:{_item.name}</Text>
                              <Text className='listItem_left_date'>{date} {week} {_item.timeType == 0 ? '上午' : _item.timeType == 1 ? '下午' : '全天'}</Text>
                            </View>
                            <View className='listItem_right'>
                              <Text
                                className='listItem_right_status' style={_item.state==0?'color:red':_item.state==1?'color:#333':'color:#999'}>{_item.state == 0 ? '审核中' : _item.state == 1 ? '已通过' : '已驳回'}</Text>
                              <Image src={Forward} className='listItem_right_arrow'/>
                            </View>
                          </View>
                          {item.state == 2 && <View className='footer'>
                            <View className='op_btn_1'>
                              <Text style={'margin:auto;'}>重新预约</Text>
                            </View>
                          </View>}
                        </View>
                      </View>
                    )
                  }):<Empty/>}

                </AtTabsPane>
              )
            })}
          </AtTabs>
        </View>
      </ScrollView>
    )
  }
}
const Empty = () => {
  return (
    <View className='empty-view'>
      <View className='empty-wrap'>
        <Image src={_Empty} className='empty-img'/>
        <Text className='empty-text'>暂无审核记录哦~</Text>
      </View>
    </View>
  )
}
export default AuditRecord
