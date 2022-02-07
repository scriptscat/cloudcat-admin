import { request } from 'umi';
import type {
  CurrentUser,
  GeographicItemType,
  UpdateEmail,
  UpdatePassword,
  UpdateUserInfo,
  UserSettingInfo,
} from './data';

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request('/api/v1/user');
}

export async function queryProvince(): Promise<{ data: GeographicItemType[] }> {
  return request('/api/geographic/province');
}

export async function queryCity(province: string): Promise<{ data: GeographicItemType[] }> {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

export function updateUserInfo(param: UpdateUserInfo) {
  return request<API.ApiResponse<undefined>>('/api/v1/user', {
    method: 'PUT',
    requestType: 'form',
    data: param,
  });
}

export function updatePassword(param: UpdatePassword) {
  return request('/api/v1/user/password', {
    method: 'PUT',
    requestType: 'form',
    data: param,
  });
}

export function updateEmail(param: UpdateEmail) {
  return request('/api/v1/user/email', {
    method: 'PUT',
    requestType: 'form',
    data: param,
  });
}

export function requestEmailCode(email: string) {
  return request('/api/v1/user/email/code', {
    method: 'POST',
    requestType: 'form',
    data: { email },
  });
}

export function userSettingInfo() {
  return request<API.ApiResponse<UserSettingInfo>>('/api/v1/user/setting');
}

export function unbindOAuth(platform: string) {
  return request<API.ApiResponse<undefined>>(`/api/v1/user/oauth?platform=${platform}`, {
    method: 'DELETE',
  });
}
