import { forgetPassword, validResetPassword } from '@/services/ant-design-pro/login';
import { LockOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Typography, Alert, message } from 'antd';
import React, { useState } from 'react';
import { Link, history } from 'umi';
import styles from './index.less';

const Message: React.FC<{
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

const ResetPassword: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [forgetState, setForgetState] = useState<API.ApiResponse<undefined>>({
    code: 0,
    msg: '',
    data: undefined,
  });
  const { code, msg } = forgetState;
  const token = history.location.query && (history.location.query.code || '');
  if (token) {
    validResetPassword(typeof token === 'string' ? token : token[0]).then((resp) => {
      if (resp.code !== 0) {
        message.error(resp.msg);
        history.push({ pathname: 'login' });
      }
    });
  } else {
    history.push({ pathname: 'login' });
    return <></>;
  }

  const handleSubmit = async (param: API.ForgetPasswordParams) => {
    setSubmitting(true);
    const resp = await forgetPassword(param.email);
    setForgetState(resp);
    if (resp.code === 0) {
      message.success('重置成功,请重新登录');
      history.push({
        pathname: 'login',
      });
    }
    setSubmitting(false);
  };

  return (
    <>
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
            <Typography.Title level={5}>请输入您的新密码</Typography.Title>
            <ProForm
              initialValues={{
                auto_login: true,
              }}
              submitter={{
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
                await handleSubmit(values as API.ForgetPasswordParams);
              }}
            >
              {code !== 0 && <Message content={msg} />}
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
            </ProForm>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
