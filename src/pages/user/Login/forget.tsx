import { forgetPassword } from '@/services/ant-design-pro/login';
import { MailOutlined } from '@ant-design/icons';
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

const Forget: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [forgetState, setForgetState] = useState<API.ApiResponse<undefined>>({
    code: 0,
    msg: '',
    data: undefined,
  });
  const { code, msg } = forgetState;

  const handleSubmit = async (param: API.ForgetPasswordParams) => {
    setSubmitting(true);
    const resp = await forgetPassword(param.email);
    setForgetState(resp);
    if (resp.code === 0) {
      message.success('请注意您的邮箱,查收重置密码邮件');
      history.push({
        pathname: '/user/login',
      });
    }
    setSubmitting(false);
  };
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
          <Typography.Title level={5}>使用邮箱接收重置密码的邮件</Typography.Title>
          <ProForm
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
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Forget;
