import { getWxQRCode, getWxQRCodeStatus } from '@/services/cloudcat/login';
import { Button, message, Modal } from 'antd';
import React, { useState } from 'react';

const WechatLogin: React.FC<{ trigger: JSX.Element; onSuccess: () => void }> = ({
  trigger,
  onSuccess,
}) => {
  const [isShowWxQRCode, setIsShowWxQRCode] = useState(false);
  const [wxQRCodeUrl, setWxQRCodeUrl] = useState({
    url: '/assert/image/wxsvc.png',
    code: '',
  }); // 显示微信二维码

  const showWxQRCode = async () => {
    try {
      const ret = await getWxQRCode();
      if (ret.code !== 0) {
        return message.warn(ret.msg);
      }
      setIsShowWxQRCode(true);

      setWxQRCodeUrl(ret.data);

      const handle = async (isshow: boolean) => {
        if (isshow) {
          try {
            const status = await getWxQRCodeStatus(ret.data.code);
            if (status.code === 0) {
              onSuccess();
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

  const Trigger = React.cloneElement(trigger, {
    ...trigger.props,
    onClick() {
      showWxQRCode();
      if (trigger.props.onClick) {
        trigger.props.onClick();
      }
    },
  });

  return (
    <>
      {Trigger}
      <Modal
        title="微信扫码登录"
        visible={isShowWxQRCode}
        onCancel={() => setIsShowWxQRCode(false)}
        footer={[
          <Button key="close" onClick={() => setIsShowWxQRCode(false)}>
            关闭
          </Button>,
        ]}
        style={{
          textAlign: 'center',
        }}
      >
        <img src={wxQRCodeUrl.url} width="200px" height="200px" />
      </Modal>
    </>
  );
};

export default WechatLogin;
