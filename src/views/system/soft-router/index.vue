<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="status" label="路由状态">
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
        <el-table-column label="Host" prop="host" width="140" />
        <el-table-column label="Port" prop="port" width="100" />
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
  name: "SoftRouter",
  inheritAttrs: false,
});

import dayjs from "dayjs";
import { EntityStatus } from "../../../api/common";
import SoftRouterAPI, {
  SoftRouterListParam,
  SoftRouterListResult,
} from "../../../api/system/soft-router";

const queryFormRef = ref();

const ids = ref<string[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive<SoftRouterListParam>({
  page: 1,
  size: 20,
  word: "",
  status: EntityStatus.Normal,
});

const pageData = ref<SoftRouterListResult[]>();

function handleQuery() {
  loading.value = true;
  SoftRouterAPI.list(queryParams)
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
