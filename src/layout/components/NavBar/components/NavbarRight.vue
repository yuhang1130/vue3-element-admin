<template>
  <div :class="['navbar__right', navbarRightClass]">
    <!-- 桌面端显示 -->
    <template v-if="isDesktop">
      <!-- 搜索 -->
      <!-- <MenuSearch /> -->

      <!-- 全屏 -->
      <Fullscreen />

      <!-- 布局大小 -->
      <SizeSelect />
    </template>

    <!-- 用户头像（个人中心、注销登录等） -->
    <el-dropdown trigger="click">
      <div class="user-profile">
        <img class="user-profile__avatar" :src="userStore.userInfo.avatar" />
        <span class="user-profile__name">{{ userStore.userInfo.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleProfileClick">
            {{ "个人中心" }}
          </el-dropdown-item>
          <el-dropdown-item divided @click="logout">
            {{ "注销登出" }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 设置面板 -->
    <div v-if="defaultSettings.showSettings" @click="settingStore.settingsVisible = true">
      <div class="i-svg:setting" />
    </div>
  </div>
</template>
<script setup lang="ts">
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { useAppStore, useSettingsStore, useUserStore, useTagsViewStore } from "@/store";

import { SidebarLightThemeEnum, ThemeEnum } from "@/enums/ThemeEnum";

const appStore = useAppStore();
const settingStore = useSettingsStore();
const userStore = useUserStore();
const tagsViewStore = useTagsViewStore();

const route = useRoute();
const router = useRouter();
const isDesktop = computed(() => appStore.device === DeviceEnum.DESKTOP);

/**
 * 打开个人中心页面
 */
function handleProfileClick() {
  router.push({ name: "Profile" });
}

// 根据主题和侧边栏配色方案选择 navbar 右侧的样式类
const navbarRightClass = computed(() => {
  const isDarkTheme = settingStore.theme === ThemeEnum.DARK;
  const isDarkBlueSidebar = settingStore.sidebarColorScheme === SidebarLightThemeEnum.DARKBLUE;

  // 如果是暗黑主题，或者是浅色主题中的深蓝色侧边栏配色
  return isDarkTheme || isDarkBlueSidebar ? "navbar__right--darkBlue" : "navbar__right--white";
});

/**
 * 注销登出
 */
function logout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>

<style lang="scss" scoped>
.navbar__right {
  display: flex;
  align-items: center;
  justify-content: center;

  & > * {
    display: inline-block;
    min-width: 40px;
    height: $navbar-height;
    line-height: $navbar-height;
    color: var(--el-text-color);
    text-align: center;
    cursor: pointer;

    &:hover {
      background: rgb(0 0 0 / 10%);
    }
  }
  .user-profile {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 13px;

    &__avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    &__name {
      margin-left: 10px;
    }
  }
}

.layout-top .navbar__right--darkBlue > *,
.layout-mix .navbar__right--darkBlue > * {
  color: #fff;
}

.layout-top .navbar__right--white > *,
.layout-mix .navbar__right--white > * {
  color: #000;
}

.dark .navbar__right > *:hover {
  color: #ccc;
}
</style>
