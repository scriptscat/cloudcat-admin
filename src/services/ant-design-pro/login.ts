// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 发送邮箱验证码 POST /api/v1/account/register/request-email-code */
export async function getEmailCaptcha(email: string) {
  return request<API.ApiRespond<undefined>>('/api/v1/account/register/request-email-code', {
    method: 'POST',
    requestType: 'form',
    data: {
      email: email,
    },
  });
}

export async function getWxQRCode(): Promise<API.ApiRespond<API.WXQRCode>> {
  return request('/api/v1/auth/wechat/request', {
    method: 'POST',
  });
}

export async function getWxQRCodeStatus(code: string): Promise<API.ApiRespond<API.WXQRCode>> {
  return request('/api/v1/auth/wechat/status', {
    method: 'POST',
    requestType: 'form',
    data: {
      code: code,
    },
  });
}
