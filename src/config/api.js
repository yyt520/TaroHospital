// 以下是业务服务器API地址
// 局域网测试使用
// var WxApiRoot = 'http://localhost:8082/wx/';
// 云平台部署时使用
let WxApiRoot = 'https://interhos.youjiankang.net/hstest';
// let WxApiRoot = 'http://222.249.173.28:38693'
export default {
  defineConstants: {
    LOCATION_APIKEY: JSON.stringify('4HCBZ-ERO6U-AQTVJ-BMVJH-FCJI6-WFB2T')
  },
  getMidHighArea:WxApiRoot+'/ncov/conf/get?code=ZGFX_AREA',
  getHighArea:WxApiRoot+'/ncov/conf/get?code=GF_AREA',
  key:'89eea42f4b974fca16a9ee35f2acfd1e',
  tmplIds:['ZEEyNDEWXMxQj03CG_3joUEoeAkR-61_2XBXWX1scCc','91F5vWCWIp9dYyUdS4QLFuIa33gfzDM8WAX9_1Aimog','DpSCCpT6AjjRQyGEW-a-g1tTcO3jw5P9eQy8w5ryfT8'],
  surplusTmplIds:['fjL81130dgH97zF7kO5IRmRn6ZSGR0TQFISyT7bxRwM'],
  imgUrl :WxApiRoot+'/ncov',
  // imgUrl :'http://123.57.11.4:8081/ncov',
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  AboutUrl: WxApiRoot + 'home/about', //介绍信息
  CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
  CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口
  AuthLoginByWX: WxApiRoot + '/ncov/wx/user/login',
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  CheckResultQuery:WxApiRoot + '/ncov/BaAppointmentController/my/result',
  checkResult:WxApiRoot + `/ncov/BaAppointmentController/result/get`,
  MyAppointApi:WxApiRoot + '/ncov/BaAppointmentController/getUserList',
  MyAuditRecord:WxApiRoot + '/ncov/BaAppointmentController/my/validate',
  queryOrgListByNameApi:WxApiRoot + '/ncov/baOrganization/getListByQueryName',
  queryComboListByOrgApi:WxApiRoot + `/ncov/BaComboController/debug/getList`,
  fetchSourceApi:WxApiRoot +`/ncov/BaSourceController/getList`,
  appointDetect:WxApiRoot+'/ncov/BaAppointmentController/add',
  generateQrcode :WxApiRoot + `/ncov/BaAppointmentController/my/qrcode`,
  uploadFile:WxApiRoot+`/ncov/uploadController/perfect/uploadPhoto`,
  deleteOrder:WxApiRoot + `/ncov/BaAppointmentController/delete`,
  cancelOrder :WxApiRoot + `/ncov/BaAppointmentController/cancel`,
  getImgCode:WxApiRoot + `/ncov/BaAppointmentController/authImg`,
  QueryAppointRecord:WxApiRoot+`/ncov/BaAppointmentController/baseInfo/get`,
  createOrder :WxApiRoot +`/ncov/order/create`,
  getApplyTrade:WxApiRoot + `/ncov/trade/apply`,
  getPreAppoint:WxApiRoot + `/ncov/BaAppointmentController/check/done`,
  checkPersonalInfo:WxApiRoot + `/ncov/BaAppointmentController/check/his/personInfo`,
  getDataDic:WxApiRoot + `/ncov/baDatadictDetail/id/value/name/list`,
  getComboInfo:WxApiRoot+ `/ncov/BaComboController/info`,
  getCommunityInfo:WxApiRoot + `/ncov/community/getInfo`,
  addEmployeeInfo:WxApiRoot + `/ncov/staff/save`,
  updateEmployeeInfo:WxApiRoot + `/ncov/staff/info/update`,
  addEpidemicSurveyApi:WxApiRoot + `/ncov/xgFlowChart/add`,
  deptListApi:WxApiRoot+`/ncov/dept/list`,
  checkEpidemicSurveyApi:WxApiRoot + `/ncov/xgFlowChart/check`,
  getEpidemicResult:WxApiRoot+`/ncov/xgFlowChart/last/get`,
  getEmployeeInfo:WxApiRoot + `/ncov/staff/info/get`,


  //
  savePatientInfo:WxApiRoot+'/ncov/person/add',
  getPatientInfoList:WxApiRoot+'/ncov/person/list',
  getPatientInfo:WxApiRoot+'/ncov/person/info',
  updatePatientInfo:WxApiRoot+"/ncov/person/update",
  deletePatient:WxApiRoot+'/ncov/person/del',
  getEpidemicInfoList:WxApiRoot+'/ncov/xgFlowChart/list'
};
