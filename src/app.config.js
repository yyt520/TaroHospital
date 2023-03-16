export default {
  pages: [
    'pages/index/index',
     // 'pages/home/home',
     // 'pages/user/user',
    'pages/auth/login/login',
    'pages/user/audit-record/auditRecord',
    'pages/home/query/checkResult',
    'pages/home/detail/detail',
    'pages/home/choice-patient/index',
    'pages/user/advance-order/advanceOrder',
    'pages/user/order-success/orderAppointSuccess',
    'pages/home/organization/organization',
    'pages/home/write-person-info/addPersonData',
    'pages/home/write-patient-info/writePatientInfo',
    'pages/home/epidemic-success/index',
    'pages/home/epidemic/index',
    'pages/home/invest-choice-patient/index',
    'pages/home/add-patient-info/index',
    'pages/user/update-patient-info/index',
    'pages/user/choice-patient/index',
    'pages/home/insert-patient-info/index',
    'pages/home/epidemic-survey/index',
    'pages/home/combo/combo',
    'pages/home/certification/certification',
    'pages/home/confirm/confirm',
    'pages/home/audit-detail/audit-detail',
    'pages/user/entourage-success/entourage-success',
    'pages/home/audit-result/audit-result',
    'pages/user/payment-success/payment-success',
    'pages/user/refund-pay/refund-payment',
    'pages/user/employee-info/index',
    'pages/user/epidemic-result/index',
    'pages/user/epidemic-patient-list/index'

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    // navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    onReachBottomDistance:40
  },
  "subpackages": [
    {
      "root": "subPackages",
      pages:[
        'pages/user/appoint-wait/appoint-wait',
        'pages/home/write-community-info/write-community-info',
        'pages/home/confirm/confirm'

      ]
    },
    ],
  preloadRule: {
    'pages/index/index': {
      network: 'wifi',
      packages: ['subPackages']
    },
  },
  // tabBar: {
  //   color: "#999",
  //   selectedColor: "#3399ff",
  //   backgroundColor: "#fff",
  //   borderStyle: 'black',
  //
  //   boxShadow: '1px 1px 2px 0',
  //
  //   list: [
  //     {
  //       pagePath: "pages/home/home",
  //       iconPath: "./assets/tab-bar/home.png",
  //       iconSize:100,
  //       selectedIconPath: "./assets/tab-bar/home-active.png",
  //       text: "首页"
  //     }, {
  //       pagePath:'pages/user/user',
  //       iconSize: 10,
  //       iconPath: "./assets/tab-bar/user.png",
  //       selectedIconPath: "./assets/tab-bar/user-active.png",
  //       text: "我的"
  //     }
  //   ],
  // },

  "permission": {
    "scope.userLocation": {
      "desc": "是否允许?"
    }
  },
}
