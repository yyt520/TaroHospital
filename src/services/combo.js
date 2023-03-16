import request from "../utils/request";
import Api from "../config/api";

/**
 * 获取医院选择列表
 * @param payload
 * @returns {Promise<void>}
 */
export  async  function queryComboListByOrgApi(payload){
  return request.get(Api.queryComboListByOrgApi,payload);
}
export  async  function  fetchSourceApi(payload){
  return request.get(Api.fetchSourceApi,payload)
}

export  async  function fetchAppointDetectApi(payload){
  return request.put(Api.appointDetect,payload)
}
export  async  function  fetchAppointSuccessQrCodeApi(payload){
  return request.get(Api.generateQrcode,payload);
}
export  async  function  fetchImgCodeApi(payload){
  return request.get(Api.getImgCode,payload)
}

export async  function  fetchApplyTradeApi(payload){
  return request.post(Api.getApplyTrade,payload)
}
export async  function  fetchPreAppointDetectApi(payload){
  return request.get(Api.getPreAppoint,payload)
}
export async  function fetchCheckPersonalInfo({name,idCard}){
  return request.get(Api.checkPersonalInfo+`?name=${name}&idCard=${idCard}`)
}

export async  function  getComboInfoByComboIdApi(){
  return request.get(Api.getComboInfo+`?comboId=2`)
}
export async function  getCommunityInfoApi(payload){
  return request.get(Api.getCommunityInfo+`?communityId=${payload}`)
}
