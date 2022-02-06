import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useModel } from 'umi';

import styles from './BaseView.less';
import { UpdateUserInfo } from '../data';
import { updateUserInfo } from '../service';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => {
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
      message.success('更新成功,3秒后刷新页面');
      setTimeout(() => window.location.reload(), 3000);
      return;
    }
    if (info.file.status === 'error') {
      if (info.file.response) {
        message.error(info.file.response.msg);
      } else {
        message.error('网络错误');
      }
    }
  };

  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload
        name="avatar"
        showUploadList={false}
        action="/api/v1/user/avatar"
        method="PUT"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  );
};

const BaseView: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState!;

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };

  const handleFinish = async (param: UpdateUserInfo) => {
    const ret = await updateUserInfo(param);
    if (ret.code === 0) {
      message.success('更新基本信息成功');
    } else {
      message.warn(ret.msg);
    }
  };

  return (
    <div className={styles.baseView}>
      <div className={styles.left}>
        <ProForm
          layout="vertical"
          onFinish={handleFinish}
          submitter={{
            resetButtonProps: {
              style: {
                display: 'none',
              },
            },
            submitButtonProps: {
              children: '更新基本信息',
            },
          }}
          initialValues={{
            ...currentUser,
          }}
          hideRequiredMark
        >
          <ProFormText
            width="md"
            name="email"
            label="邮箱"
            disabled
            rules={[
              {
                required: true,
                message: '请输入您的邮箱!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: '请输入您的用户名!',
              },
            ]}
          />
        </ProForm>
      </div>
      <div className={styles.right}>
        <AvatarView avatar={getAvatarURL()} />
      </div>
    </div>
  );
};

export default BaseView;
