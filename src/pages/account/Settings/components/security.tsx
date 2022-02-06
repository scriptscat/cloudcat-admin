import React from 'react';
import { List, message } from 'antd';
import { useModel } from 'umi';
import type { ProFormColumnsType } from '@ant-design/pro-form';
import { BetaSchemaForm } from '@ant-design/pro-form';
import type { UpdatePassword } from '../data';
import { updatePassword } from '../service';

type Unpacked<T> = T extends (infer U)[] ? U : T;

type DataItem = {
  name: string;
  state: string;
};

const changePasswordColumns: ProFormColumnsType<DataItem>[] = [
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

const SecurityView: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState!;

  const changePassword = (form: UpdatePassword) => {
    return new Promise((resolve) => {
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

  const getData = () => [
    {
      title: '账户密码',
      description: <></>,
      actions: [
        <>
          <BetaSchemaForm<DataItem>
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
      actions: [<a key="Modify">修改</a>],
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
