// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 发送邮箱验证码 POST /api/v1/account/register/request-email-code */
export async function getEmailCaptcha(email: string) {
  return request<API.ApiResponse<undefined>>('/api/v1/account/register/request-email-code', {
    method: 'POST',
    requestType: 'form',
    data: {
      email: email,
    },
  });
}

export async function getWxQRCode(
  action: 'bind' | 'login',
): Promise<API.ApiResponse<API.WXQRCode>> {
  if (action == 'bind') {
    return request('/api/v1/auth/bind/wechat/request', {
      method: 'POST',
    });
  }
  return request('/api/v1/auth/wechat/request', {
    method: 'POST',
  });
}

export async function getWxQRCodeStatus(
  code: string,
  action: 'bind' | 'login',
): Promise<API.ApiResponse<API.WXQRCode>> {
  if (action == 'bind') {
    return request('/api/v1/auth/bind/wechat/status', {
      method: 'POST',
      requestType: 'form',
      data: {
        code: code,
      },
    });
  }
  return request('/api/v1/auth/wechat/status', {
    method: 'POST',
    requestType: 'form',
    data: {
      code: code,
    },
  });
}

export async function forgetPassword(email: string): Promise<API.ApiResponse<undefined>> {
  return request('/api/v1/account/forgot-password', {
    method: 'POST',
    requestType: 'form',
    data: {
      email: email,
    },
  });
}

export async function validResetPassword(code: string): Promise<API.ApiResponse<undefined>> {
  return request('/api/v1/account/reset-password?code=' + code, {
    method: 'GET',
  });
}

export async function resetPassword(
  param: API.ResetPasswordParams,
): Promise<API.ApiResponse<undefined>> {
  return request('/api/v1/account/reset-password', {
    method: 'POST',
    requestType: 'form',
    data: param,
  });
}
