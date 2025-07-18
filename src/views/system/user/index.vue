<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="word" label="关键字">
          <el-input
            v-model="queryParams.word"
            placeholder="用户名/昵称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status" label="用户状态">
          <el-select v-model="queryParams.status" class="!w-[100px]" clearable placeholder="全部">
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never">
      <div class="mb-[10px]">
        <el-button type="success" icon="plus" @click="handleAddClick()">新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" icon="delete" @click="handleDelete()">
          删除
        </el-button>
      </div>
      <el-table
        v-loading="loading"
        size="small"
        :data="pageData"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" width="140" />
        <el-table-column label="用户名" prop="username" width="140" />
        <el-table-column label="昵称" prop="nickname" width="140" />
        <el-table-column label="角色" prop="type" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.type === UserType.SuperAdmin ? 'warning' : 'primary'">
              {{ renderType(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === EntityStatus.Normal ? 'primary' : 'warning'">
              {{ renderStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createdAt" width="150">
          <template #default="scope">
            {{ dayjs(+scope.row.createdAt * 1000).format("YYYY/MM/DD HH:mm:ss") }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleEditClick(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              link
              size="small"
              icon="delete"
              @click.stop="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-if="total > 0"
        v-model:total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="handleQuery"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "User",
  inheritAttrs: false,
});

import dayjs from "dayjs";
import { EntityStatus } from "../../../api/common";
import UserAPI, { UserListParam, UserListResult, UserType } from "../../../api/system/user";

const queryFormRef = ref();

const ids = ref<string[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive<UserListParam>({
  page: 1,
  size: 20,
  word: "",
  status: EntityStatus.Normal,
});

const pageData = ref<UserListResult[]>();

function renderStatus(status: EntityStatus) {
  switch (status) {
    case EntityStatus.Normal:
      return "正常";
    case EntityStatus.Disable:
      return "禁用";
    default:
      return "未知";
  }
}

function renderType(type: UserType) {
  switch (type) {
    case UserType.Admin:
      return "管理员";
    case UserType.SuperAdmin:
      return "超级管理员";
    default:
      return "未知";
  }
}
function handleQuery() {
  loading.value = true;
  UserAPI.list(queryParams)
    .then((data) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.size = 20;
  queryParams.word = "";
  delete queryParams.status;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});

function handleAddClick() {
  ElMessage.success("待开发～");
}

function handleEditClick(id: number) {
  // TODO 编辑接口
  console.log("id---", id);
  ElMessage.success("待开发～");
}

function handleDelete(id?: number) {
  const attrGroupIds = [id || ids.value].join(",");
  if (!attrGroupIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => {
      // TODO 删除接口
      ElMessage.success("待开发～");
      handleResetQuery();
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
// 行选择
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}
</script>
