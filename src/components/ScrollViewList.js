import {ScrollView, Text, View} from "@tarojs/components";
import moment from "moment";
import {isEmpty} from "../utils/EmptyUtil";
import React, {Component} from "react";
import '../pages/home/combo/combo.scss'
import {nextTick} from "@tarojs/runtime";

class ScrollViewList extends Component {
  static defaultProps ={
    dataArr:[]
  }
  render() {
    const {dateArr} =this.props;
    return (
      <View className='section'>
        <ScrollView
          className='scrollView'
          scrollX={true}

          scrollWithAnimation
          // scrollTop={this.state.scrollTop}
          // style={scrollStyle}
          // lowerThreshold={this.state.threshold}
          // upperThreshold={this.state.threshold}
          // onScrollToUpper={this.onScrollToUpper} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
          // onScroll={this.onScroll}
        >
          {dateArr.map((item, index) => {
            let month_day = moment(item.date).format('MM-DD');
            return (
              <View className='wrap' key={item.id + " "} onClick={() => this.props._selectedSource(item)}>
                <View className='wrap_content'
                      style={item.checked ? 'background-color:rgba(51, 153, 255, 0.698039215686274)' : 'background-color:white'}>
                  <Text className='wrap_content_week'
                        style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color: #222222;' : 'color:#333'}>{item.week}</Text>
                  <Text className='wrap_content_date'
                        style={item.checked ? 'color:#fff' : item.surplus > 0 ? 'color:#222222' : 'color:#666'}>{month_day}</Text>
                  <Text className='wrap_content_status'
                        style={item.checked ? 'color: #fff' : item.surplus > 0 ? 'color: #3299FF' : 'color:#999'}>
                    {item.surplus > 0 ? '有号' : isEmpty(item.surplus) ? '无号' : ''}
                  </Text>
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

export default ScrollViewList;
