import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {Image, Text, View} from "@tarojs/components";
import './certification.scss'
import Api from "../../../config/api";
import {isEmpty} from "../../../utils/EmptyUtil";
import {getCurrentInstance} from "@tarojs/runtime";
import * as user from "../../../utils/user";
import Config from "../../../../project.config.json";
import Img from '@assets/certification.png';
export default class UploadCertification extends Component {
  constructor() {
    super();
    this.state = {
      url: '',
      visible: true,
      isIphoneX:false
    }
  }
  componentDidMount() {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    this.setState({isIphoneX})
  }

  /**
   * 提交审核
   */
  _submitAudit = async () => {
    const {url,userId} = this.state;
    let {item} = getCurrentInstance().router.params;

    console.log(333,item);
    const {
      docUrl,
      cityid,
      date,
      entourageIdCard,
      entourageName,
      entouragePhone,
      entourageRelation,
      districtid,
      orgId,
      payType,
      provinceid,
      sourceId,
      streetdesc,
      area,
      userType,
      orgName,name,
      phone,idCard,price,
      timeType,
    } = JSON.parse(item);

    if (isEmpty(url)) {
      Taro.showToast({
        title: '请先上传证明',
        icon: 'none',
      })
      return;
    }
    const _res = await user.loginByWeixin({appid:Config.appid});
    if (_res.code === 200) {
      let item={
        cityid,
        date,
        entourageIdCard,
        entourageName,
        entouragePhone,
        entourageRelation,
        districtid,
        orgId,
        payType,
        provinceid,
        sourceId,
        streetdesc,
        userType,
        timeType,
        area,
        orgName,name,
        phone,idCard,price,
        docUrl:url
      }
        // let item ={orgName,name,date,streetdesc,phone,idCard,price};
        Taro.navigateTo({
          url:`/pages/home/confirm/confirm?item=${JSON.stringify(item)}&userType=1`
        })

    }
  }
  _chooseImage = () => {
    // 文档提供的示例
    let that = this;
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: Api.uploadFile, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          success(res) {
            const data = JSON.parse(res.data);
            console.log(333,data);
            data.code === 200 && that.setState({url:data.data}, () => {
              Taro.showToast({
                title: '上传成功',
                icon: 'none'
              })
            });
          }
        })
      }
    })

  }

  render() {
    const {url,isIphoneX} = this.state;
    console.log(333,url);
    return (
      <View className='container'>

        <View className='main'>
          <View className='upload-img-container'>
            <View className='upload-img-view'>
              <View className='upload-img-wrap' onClick={this._chooseImage}>
                <Image src={url?Api.imgUrl+url:Img} className='upload-img'/>
                <Text className='upload-text'>上传证明</Text>
              </View>
            </View>
          </View>
          <View className='upload-wrap'>
            <Text className='upload-desc'>请联系医院工作人员获取证明，并拍照上传。</Text>
          </View>
        </View>
        <View className='footer'>
          <View className='btn-submit-view' style={isIphoneX?'margin-bottom:34rpx':'margin-bottom:0rpx'} onClick={this._submitAudit}>
            <Text className='btn-submit-text'>下一步</Text>
          </View>
        </View>

      </View>
    )
  }
}
