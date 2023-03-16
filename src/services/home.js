import request from '../utils/request';
import Api from '../config/api';
import {Utils} from "../utils/common";
/**
 * 获取医院选择列表
 * @param payload
 * @returns {Promise<void>}
 */
export  async  function getQueryOrgListByNameApi(payload){
  return request.get(Api.queryOrgListByNameApi,payload);
}
export async  function getJobCaseDicApi(){
  return request.get(Api.getDataDic+`?sysId=0&orgId=0&dictNo=OCCUPATION`)
}

export async  function getPatientTypeApi(){
  return request.get(Api.getDataDic+`?sysId=0&orgId=0&dictNo=PATIENTTYPE`)
}

export async  function  callDepartmentListApi(){
  return request.get(Api.getDataDic+`?sysId=0&orgId=0&dictNo=DEPART`)

}

export   function callXG22ListApi(){
  return Utils.request(Api.getDataDic+`?sysId=0&orgId=0&dictNo=22_THRONG`,{},"GET",false,true);
}
export function callXGPersonSortApi(){
  return Utils.request(Api.getDataDic+`?sysId=0&orgId=0&dictNo=THRONG`,{},"GET",false,true);
}
export function callMidHighAreaApi(){
  return Utils.request(Api.getMidHighArea,{},"GET",false,true);
}
export function callHighAreaApi(){
  return Utils.request(Api.getHighArea,{},"GET",false,true);
}
export async function callInsertEmployeeInfoApi(data){
  return request.post(Api.addEmployeeInfo,data)
}

export async  function callGetEmployeeInfoApi(userId){
  console.log(555,Api.getEmployeeInfo+`?userId=${userId}`);
  return request.get(Api.getEmployeeInfo+`?userId=${userId}`)
}
export async  function callUpdateEmployeeInfoApi(payload){
  return request.post(Api.updateEmployeeInfo,payload)
}
export async function callCheckEpidemicSurveyApi({personId,date}){
  return request.get(Api.checkEpidemicSurveyApi+`?personId=${personId}&date=${date}`)
}

export async function callAddEpidemicSurveyApi(payload){
  return request.post(Api.addEpidemicSurveyApi,payload)
}

export async  function callDeptListApi({supId}){
  return request.post(Api.deptListApi+`?supId=${supId}`)
}
