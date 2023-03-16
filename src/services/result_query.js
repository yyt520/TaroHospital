import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取检验结果查询
 */
export async function getResultQueryListApi(payload) {
  return request.get(Api.CheckResultQuery, payload);
}
export async  function getCheckResult(payload){
  return request.get(Api.checkResult,payload);
}
