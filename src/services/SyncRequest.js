import req from '../utils/request';
import Api from '../config/api';
import {Utils} from '../utils/common'

export function  savePatientInfoApi(params){
  return Utils.request(Api.savePatientInfo,params,"POST",false,false);
}
export function callGetPatientInfoListApi({userId,page,size}){
  return Utils.request(Api.getPatientInfoList+`?userId=${userId}&page=${page}&size=${size}`,{},"GET",false,false);
}
export function  callGetPatientInfoApi({personId}){
  return Utils.request(Api.getPatientInfo+`?personId=${personId}`,{},"GET",false,false);
}
export function  callUpdatePatientInfoApi(params){
  return Utils.request(Api.updatePatientInfo,params,"POST",false,false);
}
export function  callDeletePatientApi({personId}){
  return Utils.request(Api.deletePatient+`?personId=${personId}`,{},"POST",false);
}

export function  callGetEpidemicInfoListApi({userId,date,page,size}){
  return Utils.request(Api.getEpidemicInfoList+`?userId=${userId}&date=${date}&page=${page}&size=${size}`,{},"GET",false,false);
}
