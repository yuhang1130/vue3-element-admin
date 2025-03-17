import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        // 用于 keep-alive 功能，需要与 SFC 中自动推导或显式声明的组件名称一致
        // 参考文档: https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        name: "Dashboard",
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
        },
      },
      {
        path: "401",
        component: () => import("@/views/error/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "404",
        component: () => import("@/views/error/404.vue"),
        meta: { hidden: true },
      },
      {
        path: "profile",
        name: "Profile",
        component: () => import("@/views/profile/index.vue"),
        meta: { title: "个人中心", icon: "user", hidden: true },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/user",
    name: "/system",
    meta: {
      title: "系统管理",
      icon: "menu",
      hidden: false,
      alwaysShow: false,
      params: null,
    },
    children: [
      {
        path: "user",
        component: () => import("@/views/system/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          icon: "role",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "soft-router",
        component: () => import("@/views/system/soft-router/index.vue"),
        name: "SoftRouter",
        meta: {
          title: "路由管理",
          icon: "role",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },
  {
    path: "/device-pool",
    component: Layout,
    redirect: "/device-pool/device",
    name: "/device-pool",
    meta: {
      title: "设备池管理",
      icon: "system",
      hidden: false,
      alwaysShow: false,
      params: null,
    },
    children: [
      {
        path: "device",
        component: () => import("@/views/device-pool/device/index.vue"),
        name: "Device",
        meta: {
          title: "云手机管理",
          icon: "tree",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
      },
      {
        path: "container",
        component: () => import("@/views/device-pool/container/index.vue"),
        name: "Container",
        meta: {
          title: "环境管理",
          icon: "dict",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },
  {
    path: "/api",
    component: Layout,
    name: "/api",
    meta: {
      title: "接口文档",
      icon: "api",
      hidden: false,
      alwaysShow: true,
      params: null,
    },
    children: [
      {
        path: "manage-api",
        component: () => import("@/views/api/manage/index.vue"),
        name: "ManageApi",
        meta: {
          title: "ManageApi",
          icon: "api",
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
          params: null,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
