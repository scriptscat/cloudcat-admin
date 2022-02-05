import {
  LockOutlined,
  UserOutlined,
  WechatOutlined,
  MailOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs, Modal, Button } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login, register } from '@/services/cloudcat/api';
import { getEmailCaptcha, getWxQRCode, getWxQRCodeStatus } from '@/services/cloudcat/login';
import { parse } from 'querystring';
import styles from './index.less';

const { search } = history.location;
const param = parse(search.substr(1));
const { redirect } = param as {
  redirect: string;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.ApiResponse<undefined>>({
    code: 0,
    msg: '',
    data: undefined,
  });
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s: any) => ({ ...s, currentUser: userInfo }));
    }
  };

  const loginForm = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      // 登录
      const msg = await login({ ...values, type });

      if (msg.code === 0) {
        message.success('登录成功！');

        if (redirect === 'scriptcat') {
          window.close();
          return;
        }

        await fetchUserInfo();
        history.push(redirect || '/');
        return;
      } // 如果失败去设置用户错误信息

      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }

    setSubmitting(false);
  };

  const registerForm = async (values: API.LoginParams) => {
    setSubmitting(true);

    try {
      // 登录
      const msg = await register({ ...values, type });

      if (msg.code === 0) {
        message.success('注册成功！快去登录吧！');
        setType('account');
        setSubmitting(false);
        return;
      } // 如果失败去设置用户错误信息

      setUserLoginState(msg);
    } catch (error) {
      message.error('登录失败，请重试！');
    }

    setSubmitting(false);
  };

  const handleSubmit = (values: API.LoginParams) => {
    setUserLoginState({
      code: 0,
      msg: '',
      data: undefined,
    });

    if (type === 'account') {
      loginForm(values);
    } else {
      registerForm(values);
    }
  };

  const [isShowWxQRCode, setIsShowWxQRCode] = useState(false);
  const [wxQRCodeUrl, setWxQRCodeUrl] = useState({
    url: '/assert/image/wxsvc.png',
    code: '',
  }); // 显示微信二维码

  const showWxQRCode = async () => {
    try {
      setIsShowWxQRCode(true);
      const ret = await getWxQRCode();
      setWxQRCodeUrl(ret.data);

      const handle = async (isshow: boolean) => {
        if (isshow) {
          try {
            const status = await getWxQRCodeStatus(ret.data.code);

            if (status.code === 0) {
              message.success('登录成功！');

              if (redirect === 'scriptcat') {
                window.close();
                return;
              }

              await fetchUserInfo();
              history.push(redirect || '/');
            } else {
              setTimeout(() => {
                setIsShowWxQRCode((v) => {
                  handle(v);
                  return v;
                });
              }, 1000);
            }
          } catch (e) {
            message.error('系统或者网络发送错误！微信扫码请求失败！');
            setIsShowWxQRCode(false);
          }
        }
      };

      return setTimeout(() => {
        setIsShowWxQRCode((v) => {
          handle(v);
          return v;
        });
      }, 1000);
    } catch {
      message.error('微信二维码获取失败！');
      return setIsShowWxQRCode(false);
    }
  };

  const handleCancel = () => {
    setIsShowWxQRCode(false);
  };

  const { code, msg } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.png" />
              <span className={styles.title}>CloudCat</span>
            </Link>
          </div>
          <div className={styles.desc}>CloudCat 在云端执行你的ScriptCat脚本</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              auto_login: true,
            }}
            submitter={{
              searchConfig: {
                submitText: type === 'account' ? '登录' : '注册',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="account" tab="登录" />
              <Tabs.TabPane key="register" tab="注册" />
            </Tabs>

            {code !== 0 && <LoginMessage content={msg} />}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="用户名或邮箱"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名或邮箱',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
                <div
                  style={{
                    marginBottom: '24px',
                  }}
                >
                  <ProFormCheckbox noStyle name="auto_login">
                    自动登录
                  </ProFormCheckbox>
                  <Space
                    style={{
                      float: 'right',
                    }}
                    size={'small'}
                  >
                    <Link
                      to={{
                        pathname: '/user/forget-password',
                      }}
                      style={{
                        marginRight: '10px',
                      }}
                    >
                      找回密码
                    </Link>
                    <a onClick={() => setType('register')}>注册账号</a>
                  </Space>
                </div>
              </>
            )}
            {type === 'register' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  name="username"
                  placeholder="用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名',
                    },
                    {
                      min: 3,
                      max: 10,
                      message: '用户名格式错误,请输入3-10个字符！',
                    },
                  ]}
                />
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MailOutlined className={styles.prefixIcon} />,
                  }}
                  name="email"
                  placeholder="邮箱"
                  rules={[
                    {
                      required: true,
                      message: '请输入邮箱',
                    },
                    {
                      type: 'email',
                      message: '请输入合法的邮箱',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder="请输入验证码"
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count} 秒后重新获取`;
                    }

                    return '获取验证码';
                  }}
                  name="captcha"
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                    {
                      pattern: /^\d{6}$/,
                      message: '请输入6位数字的验证码',
                    },
                  ]}
                  phoneName="email"
                  onGetCaptcha={async (email) => {
                    const result = await getEmailCaptcha(email);

                    if (result.code !== 0) {
                      message.error(result.msg);
                      return;
                    }

                    message.success('获取验证码成功！请注意查收！');
                  }}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                    {
                      min: 8,
                      max: 16,
                      message: '请输入8-16位密码',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="repassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="确认密码"
                  rules={[
                    {
                      required: true,
                      message: '请再输入一次密码！',
                    },
                    {
                      min: 8,
                      max: 16,
                      message: '请输入8-16位密码',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('两次输入的密码必须匹配'));
                      },
                    }),
                  ]}
                />
                <div
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <a
                    style={{
                      float: 'right',
                      marginBottom: 24,
                    }}
                    onClick={() => setType('account')}
                  >
                    我有账号，前去登录
                  </a>
                </div>
              </>
            )}
          </ProForm>
          <Space className={styles.other}>
            <WechatOutlined className={styles.icon} onClick={showWxQRCode} />
            <a
              href={`/api/v1/auth/bbs?redirect=${encodeURIComponent(
                redirect === 'scriptcat' ? '/user/login/?redirect=scriptcat' : redirect || '/',
              )}`}
            >
              <AppstoreOutlined className={styles.icon} />
            </a>
          </Space>
          <Modal
            title="微信扫码登录"
            visible={isShowWxQRCode}
            onCancel={handleCancel}
            footer={[
              <Button key="close" onClick={handleCancel}>
                关闭
              </Button>,
            ]}
            style={{
              textAlign: 'center',
            }}
          >
            <img src={wxQRCodeUrl.url} width="200px" height="200px" />
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
