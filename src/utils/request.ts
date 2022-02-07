import { message } from 'antd';

export function showRespMsg(resp: API.ApiResponse<any>, success: string) {
  if (resp.code === 0) {
    message.success(success);
  } else {
    message.warn(resp.msg);
  }
}
