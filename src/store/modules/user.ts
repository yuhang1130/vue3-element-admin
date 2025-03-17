import { store } from "@/store";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { setAccessToken, clearToken } from "@/utils/auth";
import UserAPI, { LoginData, UserInfoResult } from "../../api/system/user";

export const useUserStore = defineStore("user", () => {
  const userInfo = useStorage<UserInfoResult>("userInfo", {} as UserInfoResult);

  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      UserAPI.login(loginData)
        .then((data) => {
          const { token } = data;
          setAccessToken(token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function getUserInfo() {
    return new Promise<UserInfoResult>((resolve, reject) => {
      UserAPI.info()
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          data.avatar = "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif";
          Object.assign(userInfo.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function logout() {
    return new Promise<void>((resolve, reject) => {
      UserAPI.logout()
        .then(() => {
          clearUserData();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function clearUserData() {
    return new Promise<void>((resolve) => {
      clearToken();
      usePermissionStoreHook().resetRouter();
      resolve();
    });
  }

  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    clearUserData,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
