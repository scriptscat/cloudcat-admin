import React, { useEffect, useState } from 'react';
import type { FormInstance } from 'antd';
import { Button, Col, Input, List, message, Row } from 'antd';
import { useModel } from 'umi';
import type { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import type { UpdateEmail, UpdatePassword } from '../data';
import { requestEmailCode, updateEmail, updatePassword } from '../service';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const changePasswordColumns: ProFormColumnsType<UpdatePassword>[] = [
  {
    title: '旧密码',
    dataIndex: 'old-password',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'password',
    width: 'm',
  },
  {
    title: '新密码',
    dataIndex: 'password',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'password',
    width: 'm',
  },
  {
    title: '确认新密码',
    dataIndex: 'repassword',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    valueType: 'password',
    width: 'm',
  },
];

let timer: NodeJS.Timer | undefined;
const RequestEmail = (config: any & { form: FormInstance }) => {
  const { form } = config;
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    if (timer) {
      clearTimeout(timer);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  });
  useEffect(() => {
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((v) => v - 1), 1000);
    } else if (timer) {
      clearTimeout(timer);
    }
  }, [countdown]);
  const onClick = () => {
    requestEmailCode(form.getFieldValue('email')).then((ret) => {
      if (ret.code === 0) {
        message.success('验证码发送成功,请注意查收');
        setCountdown(60);
      } else {
        message.warn(ret.msg);
      }
    });
  };
  return (
    <Row gutter={8}>
      <Col span={12}>
        <Input {...config} />
      </Col>
      <Col span={12}>
        <Button onClick={onClick} disabled={!!countdown}>
          {countdown ? `${countdown.toString()}秒后获取` : '获取验证码'}
        </Button>
      </Col>
    </Row>
  );
};

const changeEmailColumns: ProFormColumnsType<UpdateEmail>[] = [
  {
    title: '邮箱',
    dataIndex: 'email',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
        { type: 'email', message: '请输入合法的邮箱' },
      ],
    },
    width: 'm',
  },
  {
    title: '邮箱验证码',
    dataIndex: 'code',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
        {
          len: 6,
          message: '邮箱验证码必须为6位',
        },
      ],
    },
    renderFormItem: (schema, config, form) => {
      return <RequestEmail form={form} {...config} />;
    },
    width: 'm',
  },
];

const SecurityView: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const { currentUser } = initialState!;

  const changePassword = (form: UpdatePassword) => {
    return new Promise<boolean | void>((resolve) => {
      updatePassword(form).then((ret) => {
        if (ret.code === 0) {
          message.success('密码更新成功');
          resolve(true);
        } else {
          message.warn(ret.msg);
          resolve(false);
        }
      });
    });
  };
  const changeEmail = (form: UpdateEmail) => {
    return new Promise<boolean | void>((resolve) => {
      updateEmail(form).then((ret) => {
        if (ret.code === 0) {
          setInitialState((v) => {
            const v1 = v;
            if (v1 && v1.currentUser) {
              v1.currentUser.email = form.email;
            }
            return v1;
          });
          message.success('邮箱更新成功');
          resolve(true);
        } else {
          message.warn(ret.msg);
          resolve(false);
        }
      });
    });
  };

  const getData = () => [
    {
      title: '账户密码',
      description: <></>,
      actions: [
        <>
          <BetaSchemaForm<UpdatePassword>
            title="修改密码"
            trigger={<a>修改</a>}
            preserve={false}
            width="400px"
            submitter={{
              // 配置按钮文本
              searchConfig: {
                submitText: '修改密码',
              },
            }}
            layoutType="ModalForm"
            columns={changePasswordColumns}
            onFinish={changePassword}
          />
        </>,
      ],
    },
    {
      title: '绑定邮箱',
      description: <>已绑定邮箱：{currentUser!.email}</>,
      actions: [
        <>
          <BetaSchemaForm<UpdateEmail>
            title="修改邮箱"
            trigger={<a>修改</a>}
            preserve={false}
            width="400px"
            submitter={{
              // 配置按钮文本
              searchConfig: {
                submitText: '修改邮箱',
              },
            }}
            layoutType="ModalForm"
            columns={changeEmailColumns}
            onFinish={changeEmail}
          />
        </>,
      ],
    },
  ];

  const data = getData();
  return (
    <>
      <List<Unpacked<typeof data>>
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </>
  );
};

export default SecurityView;
