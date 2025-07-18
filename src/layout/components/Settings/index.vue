<template>
  <el-drawer v-model="settingsVisible" size="300" title="项目配置">
    <el-divider>{{ "主题设置" }}</el-divider>

    <div class="flex-center">
      <el-switch v-model="isDark" active-icon="Moon" inactive-icon="Sunny" @change="changeTheme" />
    </div>

    <el-divider>{{ "界面设置" }}</el-divider>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ "主题颜色" }}</span>
      <ThemeColorPicker v-model="settingsStore.themeColor" @update:model-value="changeThemeColor" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ "开启 Tags-View" }}</span>
      <el-switch v-model="settingsStore.tagsView" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ "侧边栏 Logo" }}</span>
      <el-switch v-model="settingsStore.sidebarLogo" />
    </div>

    <div class="py-1 flex-x-between">
      <span class="text-xs">{{ "开启水印" }}</span>
      <el-switch v-model="settingsStore.watermarkEnabled" />
    </div>
    <div v-if="!isDark" class="py-1 flex-x-between">
      <span class="text-xs">{{ "侧边栏配色方案" }}</span>
      <el-radio-group v-model="settingsStore.sidebarColorScheme" @change="changeSidebarColorScheme">
        <el-radio :value="SidebarLightThemeEnum.WHITE">{{ "白色" }}</el-radio>
        <el-radio :value="SidebarLightThemeEnum.DARKBLUE">{{ "深蓝色" }}</el-radio>
      </el-radio-group>
    </div>

    <el-divider>{{ "导航设置" }}</el-divider>
    <LayoutSelect v-model="settingsStore.layout" @update:model-value="changeLayout" />
  </el-drawer>
</template>

<script setup lang="ts">
import { LayoutEnum } from "@/enums/LayoutEnum";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { SidebarLightThemeEnum } from "@/enums/ThemeEnum";
import { useSettingsStore, usePermissionStore, useAppStore } from "@/store";

const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const isDark = ref<boolean>(settingsStore.theme === ThemeEnum.DARK);

const settingsVisible = computed({
  get() {
    return settingsStore.settingsVisible;
  },
  set() {
    settingsStore.settingsVisible = false;
  },
});

/**
 *  切换主题颜色
 *
 * @param color 颜色
 */
function changeThemeColor(color: string) {
  settingsStore.changeThemeColor(color);
}

/**
 * 切换主题
 *
 * @param val 是否为暗黑模式
 */
const changeTheme = (val: any) => {
  isDark.value = val;
  settingsStore.changeTheme(isDark.value ? ThemeEnum.DARK : ThemeEnum.LIGHT);
};

/**
 * 更改侧边栏颜色方案
 *
 * @param val 颜色方案名称
 */
const changeSidebarColorScheme = (val: any) => {
  console.log(val);
  settingsStore.changeSidebarColorScheme(val);
};

/**
 * 切换布局
 *
 * @param layout 布局  LayoutEnum
 */
function changeLayout(layout: LayoutEnum) {
  settingsStore.changeLayout(layout);
  if (layout === LayoutEnum.MIX) {
    route.name && againActiveTop(route.name as string);
  }
}

/**
 * 重新激活顶部菜单
 *
 * @param routeName 路由名称
 */
function againActiveTop(routeName: string) {
  const parent = findOutermostParent(permissionStore.routes, routeName);
  if (appStore.activeTopMenuPath !== parent.path) {
    appStore.activeTopMenu(parent.path);
  }
}

/**
 * 查找最外层父级
 *
 * @param tree 树形数据
 * @param findName 查找的名称
 */
function findOutermostParent(tree: any[], findName: string) {
  let parentMap: any = {};

  function buildParentMap(node: any, parent: any) {
    parentMap[node.name] = parent;

    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        buildParentMap(node.children[i], node);
      }
    }
  }

  for (let i = 0; i < tree.length; i++) {
    buildParentMap(tree[i], null);
  }

  let currentNode = parentMap[findName];
  while (currentNode) {
    if (!parentMap[currentNode.name]) {
      return currentNode;
    }
    currentNode = parentMap[currentNode.name];
  }

  return null;
}
</script>

<style lang="scss" scoped></style>
