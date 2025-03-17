import type { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import router from "@/router";

export const usePermissionStore = defineStore("permission", () => {
  // 储所有路由，包括静态路由和动态路由
  // const routes = ref<RouteRecordRaw[]>([]);
  const routes = ref<RouteRecordRaw[]>(constantRoutes);
  // 混合模式左侧菜单路由
  const mixedLayoutLeftRoutes = ref<RouteRecordRaw[]>([]);
  // 路由是否加载完成
  // const isRoutesLoaded = ref(false);
  const isRoutesLoaded = ref<boolean>(true);

  /**
   * 获取后台动态路由数据，解析并注册到全局路由
   *
   * @returns Promise<RouteRecordRaw[]> 解析后的动态路由列表
   */
  function generateRoutes() {
    console.log("generateRoutes-----");
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      routes.value = [...constantRoutes];
      isRoutesLoaded.value = true;
      resolve([]);
      // FIX: 可以获取后台动态路由数据，解析并注册到全局路由
    });
  }

  /**
   * 根据父菜单路径设置混合模式左侧菜单
   *
   * @param parentPath 父菜单的路径，用于查找对应的菜单项
   */
  const setMixedLayoutLeftRoutes = (parentPath: string) => {
    const matchedItem = routes.value.find((item) => item.path === parentPath);
    if (matchedItem && matchedItem.children) {
      mixedLayoutLeftRoutes.value = matchedItem.children;
    }
  };

  /**
   * 重置路由
   */
  const resetRouter = () => {
    //  从 router 实例中移除动态路由
    routes.value.forEach((route) => {
      if (route.name && !constantRoutes.find((r) => r.name === route.name)) {
        router.removeRoute(route.name);
      }
    });

    // 清空本地存储的路由和菜单数据
    routes.value = [];
    mixedLayoutLeftRoutes.value = [];
    isRoutesLoaded.value = false;
  };

  return {
    routes,
    mixedLayoutLeftRoutes,
    isRoutesLoaded,
    generateRoutes,
    setMixedLayoutLeftRoutes,
    resetRouter,
  };
});

/**
 * 在组件外使用 Pinia store 实例 @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
