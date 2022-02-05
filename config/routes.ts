export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: 'login',
            component: './user/Login',
          },
          {
            name: '忘记密码',
            path: 'forget-password',
            component: './user/Login/forget',
          },
          {
            name: '重置密码',
            path: 'reset-password',
            component: './user/Login/reset',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: '二级管理页',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account',
    name: '个人中心',
    hideInMenu: true,
    icon: 'user',
    routes: [
      {
        name: '用户中心',
        path: '/account/center',
        component: './account/Center',
      },
      {
        name: '个人设置',
        icon: 'smile',
        path: '/account/settings',
        component: './account/Settings',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
