import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { parse } from 'querystring';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export const request: RequestConfig = {
  errorHandler(err) {
    const { response, data } = err;
    if (response && response.status >= 200 && response.status < 500) {
      return data;
    }
    if (data && data.msg) {
      message.error(data.msg);
      throw data;
    }
    message.error('发生了一个网络错误');
    throw data;
  },
  errorConfig: {
    adaptor: (resData) => {
      if (resData.code === undefined) {
        return {
          ...resData,
          success: false,
          errorMessage: '系统或网络错误',
        };
      }
      return {
        ...resData,
        success: true,
        errorMessage: resData.msg,
      };
    },
  },
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.ApiRespond<API.UserInfo>;
  fetchUserInfo?: () => Promise<API.ApiRespond<API.UserInfo> | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (!history.location.pathname.startsWith(loginPath)) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  // 是登录页面判断redirect是否为scriptcat,是查询是否登录,然后close
  const { search } = history.location;
  const param = parse(search.substr(1));
  const { redirect } = param as { redirect: string };
  if (redirect === 'scriptcat') {
    try {
      const msg = await queryCurrentUser();
      window.close();
      return {
        fetchUserInfo,
        currentUser: msg,
        settings: {},
      };
    } catch (error) {
      console.log('redirect error: ' + error);
    }
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && !location.pathname.startsWith(loginPath)) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
