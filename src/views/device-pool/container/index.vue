<!-- 字典 -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="word">
          <el-input
            v-model="queryParams.word"
            placeholder="容器名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input
            v-model="queryParams.deviceId"
            placeholder="设备ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="容器状态" prop="state">
          <el-select v-model="queryParams.state" class="!w-[100px]" clearable placeholder="全部">
            <el-option value="created" label="已经创建" />
            <el-option value="running" label="正在运行" />
            <el-option value="exited" label="停止" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery()">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery()">重置</el-button>
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
        highlight-current-row
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" width="170" />
        <el-table-column label="设备ID" prop="cloudDeviceId" width="170" />
        <el-table-column label="容器名称" prop="name" width="130" />
        <el-table-column label="Index" prop="index" width="70" />
        <el-table-column label="容器IP" prop="host" width="120" />
        <el-table-column label="容器状态" prop="state" width="100">
          <template #default="scope">
            <el-tag :type="renderStateType(scope.row.state)">
              {{ renderState(scope.row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态信息" prop="stateMsg" width="100" />
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
        <el-table-column fixed="right" label="文件路径" prop="data" />
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
  name: "Container",
  inherititems: false,
});

import DevicePoolAPI, {
  ContainerListParam,
  ContainerListResult,
  StateType,
} from "../../../api/device-pool";

const queryFormRef = ref();

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<ContainerListParam>({
  page: 1,
  size: 20,
  word: "",
  deviceId: "",
  // state: StateType.Running,
});

const tableData = ref<ContainerListResult[]>();

function handleQuery() {
  loading.value = true;
  DevicePoolAPI.containerList(queryParams)
    .then((data) => {
      tableData.value = data.list;
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
  delete queryParams.state;
  handleQuery();
}

function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

// 新增字典
function handleAddClick() {
  ElMessage.success("待开发～");
}

/**
 * 编辑字典
 *
 * @param id 字典ID
 */
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

function renderState(state: StateType) {
  switch (state) {
    case StateType.Created:
      return "已创建";
    case StateType.Exited:
      return "停止";
    case StateType.Running:
      return "正在运行";
    default:
      return "未知";
  }
}

function renderStateType(state: StateType) {
  switch (state) {
    case StateType.Created:
      return "info";
    case StateType.Exited:
      return "danger";
    case StateType.Running:
      return "success";
    default:
      return "info";
  }
}

onMounted(() => {
  handleQuery();
});
</script>
