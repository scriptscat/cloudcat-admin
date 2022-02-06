import { AppstoreOutlined, WechatOutlined } from '@ant-design/icons';
import { List } from 'antd';
import React, { Fragment } from 'react';

const BindingView: React.FC = () => {
  const getData = () => [
    {
      title: '绑定微信',
      description: '当前未绑定微信账号',
      actions: [<a key="Bind">绑定</a>],
      avatar: <WechatOutlined className="taobao" />,
    },
    {
      title: '绑定油猴中文网',
      description: '当前未绑定油猴中文网账号',
      actions: [<a key="Bind">绑定</a>],
      avatar: <AppstoreOutlined className="alipay" />,
    },
    // {
    //   title: '绑定钉钉',
    //   description: '当前未绑定钉钉账号',
    //   actions: [<a key="Bind">绑定</a>],
    //   avatar: <DingdingOutlined className="dingding" />,
    // },
  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
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
