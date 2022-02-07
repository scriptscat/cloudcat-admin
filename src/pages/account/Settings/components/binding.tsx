import { AppstoreOutlined, WechatOutlined } from '@ant-design/icons';
import { List, message } from 'antd';
import React, { Fragment } from 'react';
import { useRequest } from 'umi';
import { unbindOAuth, userSettingInfo } from '../service';
import WechatLogin from '@/components/User/WechatLogin';

const BindingView: React.FC = () => {
  const { data, error, loading, refresh } = useRequest(() => {
    return userSettingInfo();
  });

  let list: any[] = [];
  if (error) {
    message.error('数据获取错误');
    return <></>;
  }

  if (data) {
    let bindWx;
    if (data.open.wechat) {
      bindWx = (
        <a
          key="Bind"
          onClick={async () => {
            const resp = await unbindOAuth('wechat');
            if (resp.code === 0) {
              message.success('解绑油猴中文网成功');
              refresh();
            } else {
              message.warn(resp.msg);
            }
          }}
        >
          解绑
        </a>
      );
    } else {
      bindWx = (
        <WechatLogin
          trigger={<a>绑定</a>}
          onSuccess={() => {
            message.success('微信绑定成功');
            refresh();
          }}
        />
      );
    }
    list = [
      {
        title: '绑定微信',
        description: data.open.wechat ? '已绑定微信' : '当前未绑定微信账号',
        actions: [bindWx],
        avatar: <WechatOutlined className="wechat" />,
      },
      {
        title: '绑定油猴中文网',
        description: data.open.bbs ? '已绑定油猴中文网' : '当前未绑定油猴中文网账号',
        actions: [
          <a
            key="Bind"
            onClick={async () => {
              if (data.open.bbs) {
                const resp = await unbindOAuth('bbs');
                if (resp.code === 0) {
                  message.success('解绑油猴中文网成功');
                  refresh();
                } else {
                  message.warn(resp.msg);
                }
              } else {
                window.location.href = '/api/v1/auth/bbs';
              }
            }}
          >
            {data.open.bbs ? '解绑' : '绑定'}
          </a>,
        ],
        avatar: <AppstoreOutlined className="alipay" />,
      },
    ];
  }

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        loading={loading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
