export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: 'login',
            component: './user/Login',
          },
          {
            name: 'forget-password',
            path: 'forget-password',
            component: './user/Login/forget'
          },
          {
            name: 'reset-password',
            path: 'reset-password',
            component: './user/Login/reset'
          }
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
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
    routes: [
      {
        path: '/account/center',
        name: '个人中心',
        component: './account/Center',
      },
      {
        path: '/account/settings',
        name: '个人设置',
        component: './account/Settings',
      }
    ]
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
