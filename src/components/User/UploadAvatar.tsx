import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { useModel } from 'umi';

function getBase64(img: any, callback: (url: string) => void) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const UploadAvatar: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState!;

  const [imageInfo, setImageInfo] = useState<{ loading: boolean; imageUrl?: string | null }>({
    loading: false,
    imageUrl: currentUser!.avatar,
  });

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setImageInfo({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setImageInfo({
          imageUrl,
          loading: false,
        }),
      );
    }
    if (info.file.status === 'error') {
      if (info.file.response) {
        message.error(info.file.response.msg);
      } else {
        message.error('网络错误');
      }
    }
  };

  const { loading, imageUrl } = imageInfo;

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/v1/user/avatar"
      method="PUT"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default UploadAvatar;
