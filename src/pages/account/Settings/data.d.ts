export type TagType = {
  key: string;
  label: string;
};

export type GeographicItemType = {
  name: string;
  id: string;
};

export type GeographicType = {
  province: GeographicItemType;
  city: GeographicItemType;
};

export type NoticeType = {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
};

export type UpdateUserInfo = {
  username: string;
};

export type UpdatePassword = {
  oldPassword: string;
  password: string;
  repassword: string;
};

export type UpdateEmail = {
  email: string;
  code: string;
};

export type UserSettingInfo = {
  info: UserInfo;
  open: {
    bbs: boolean;
    wechat: boolean;
  };
};
