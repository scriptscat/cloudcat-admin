import { request } from 'umi';
import type { CurrentUser, GeographicItemType, UpdatePassword, UpdateUserInfo } from './data';

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
