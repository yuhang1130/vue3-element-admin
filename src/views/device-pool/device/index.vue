<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item prop="word" label="关键字">
          <el-input
            v-model="queryParams.word"
            placeholder="设备名称/别名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="status" label="设备状态">
          <el-select v-model="queryParams.status" class="!w-[100px]" clearable placeholder="全部">
            <el-option :value="50" label="使用中" />
            <el-option :value="-10" label="已过期" />
            <el-option :value="-50" label="已注销" />
          </el-select>
        </el-form-item>
        <el-form-item prop="instanceHost" label="板卡IP">
          <el-input
            v-model="queryParams.instanceHost"
            placeholder="板卡IP搜索"
            clearable
            @keyup.enter="handleQuery"
          />
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
        <el-table-column label="板卡IP" prop="instanceHost" width="100" />
        <el-table-column label="设备别名" prop="deviceAliases" width="120" />
        <el-table-column label="设备名称" prop="deviceName" width="130" />
        <el-table-column label="设备状态" prop="status" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 50 ? 'success' : 'info'">
              {{ renderStatus(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="设备厂商" prop="deviceManufacturer" width="65">
          <template #default="scope">
            <el-tag type="primary">{{ scope.row.deviceManufacturer }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前容器ID" prop="runningContainerId" width="140" />
        <el-table-column label="当前容器Index" prop="runningContainerIndex" width="100" />
        <el-table-column label="当前容器状态" prop="runningContainerState" width="90">
          <template #default="scope">
            <el-tag :type="renderStateType(scope.row.runningContainerState)">
              {{ renderState(scope.row.runningContainerState) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="当前容器信息" prop="runningContainerStateMsg" width="90" />
        <el-table-column label="中控地址" prop="controlNodeUrl" width="190" />
        <el-table-column label="MYT服务地址" prop="mytSdkServerUrl" width="150" />
        <el-table-column label="分配租户ID" prop="assignedTenantId" width="80" />
        <el-table-column label="绑定中控状态" prop="boundStatus" width="90" />
        <el-table-column label="所属软路由" prop="softRoute" width="150" />
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
  name: "Device",
  inheritAttrs: false,
});

import DevicePoolAPI, {
  DeviceListParam,
  DeviceListResult,
  DeviceStatus,
  StateType,
} from "../../../api/device-pool";

const queryFormRef = ref();

const ids = ref<string[]>([]);
const loading = ref(false);
const total = ref(0);

const queryParams = reactive<DeviceListParam>({
  page: 1,
  size: 20,
  word: "",
  // status: DeviceStatus.InUse,
  instanceHost: "",
});

const pageData = ref<DeviceListResult[]>();

function renderStatus(status: DeviceStatus) {
  switch (status) {
    case DeviceStatus.Expired:
      return "已过期";
    case DeviceStatus.InUse:
      return "使用中";
    case DeviceStatus.Revoked:
      return "已注销";
    default:
      return "未知";
  }
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

function handleQuery() {
  loading.value = true;
  DevicePoolAPI.deviceList(queryParams)
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
  queryParams.instanceHost = "";
  delete queryParams.status;
  handleQuery();
}

onMounted(() => {
  handleQuery();
});

function handleAddClick() {
  // TODO 新增接口
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
