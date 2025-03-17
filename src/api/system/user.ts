import request from "@/utils/request";
import { BaseEntityResult, BaseListParam, BaseListResult, EntityStatus } from "../common";

const USER_BASE_URL = "/admin/user";

const UserAPI = {
  register(data: RegisterData) {
    return request<any, RegisterResult>({
      url: `${USER_BASE_URL}/register`,
      method: "post",
      data: data,
    });
  },
  login(data: LoginData) {
    return request<any, LoginResult>({
      url: `${USER_BASE_URL}/login`,
      method: "post",
      data: data,
    });
  },
  logout() {
    return request<any, boolean>({
      url: `${USER_BASE_URL}/logout`,
      method: "post",
    });
  },
  getCaptcha() {
    return request<any, CaptchaResult>({
      url: `${USER_BASE_URL}/captcha`,
      method: "get",
    });
  },
  info() {
    return request<any, UserInfoResult>({
      url: `${USER_BASE_URL}/info`,
      method: "post",
    });
  },
  list(data: UserListParam) {
    return request<any, BaseListResult<UserListResult>>({
      url: `${USER_BASE_URL}/list`,
      method: "post",
      data: data,
    });
  },
};

export default UserAPI;

export interface RegisterData {
  username: string;
  password: string;
}

export interface RegisterResult extends BaseEntityResult {
  nickname: string;
  status: number;
  type: number;
  username: string;
}

export interface LoginData {
  username: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
}

export interface LoginResult {
  token: string;
  tokenType: string; // Bearer
  expiresIn: number; // 秒
}

export interface CaptchaResult {
  captchaKey: string;
  captchaBase64: string;
}

export interface UserInfoResult {
  id: string;
  username: string;
  nickname: string;
  type: number;
  avatar: string;
  mobile: string;
  email: string;
  createdAt: string;
  roles?: string[];
  perms?: string[];
}

export interface UserProfileForm {
  id?: number;

  username?: string;

  nickname?: string;

  avatar?: string;

  mobile?: string;

  email?: string;
}

export interface PasswordChangeForm {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface MobileUpdateForm {
  mobile?: string;
  code?: string;
}

export interface EmailUpdateForm {
  email?: string;
  code?: string;
}

export interface UserListParam extends BaseListParam {
  status?: EntityStatus.Normal;
}

export interface UserListResult extends BaseEntityResult {
  nickname: string;
  status: number;
  type: number;
  username: string;
}

export enum UserType {
  SuperAdmin = 1,
  Admin = 2,
}
