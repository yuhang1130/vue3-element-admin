import request from "@/utils/request";
import { BaseListParam, BaseListResult } from "../common";

const Device_Pool_BASE_URL = "/admin/device-pool";

const DevicePoolAPI = {
  deviceList(data: DeviceListParam) {
    return request<any, BaseListResult<DeviceListResult>>({
      url: `${Device_Pool_BASE_URL}/device/list`,
      method: "post",
      data: data,
    });
  },
  containerList(data: ContainerListParam) {
    return request<any, BaseListResult<ContainerListResult>>({
      url: `${Device_Pool_BASE_URL}/container/list`,
      method: "post",
      data: data,
    });
  },
};

export default DevicePoolAPI;

export enum DeviceStatus {
  Revoked = -50, // 已注销
  Expired = -10, // 已过期
  InUse = 50, // 使用中
}

export enum StateType {
  Created = "created", // 已经创建
  Running = "running", // 正在运行
  Exited = "exited", // 停止
}

export interface DeviceListParam extends BaseListParam {
  instanceHost?: string;
  status?: DeviceStatus;
}

export interface ContainerListParam extends BaseListParam {
  deviceId?: string;
  state?: StateType;
}

export interface DeviceListResult {
  assignedTenantId: number;
  boundStatus: number;
  cloudTenantId: string;
  cloudUserId: string;
  controlNodeEndpoint: string;
  controlNodeScheme: string;
  controlNodeUrl: string;
  createdAt: string;
  deviceAliases: string;
  deviceHost: string;
  deviceId: string;
  deviceManufacturer: string;
  deviceName: string;
  extInfo: { [key: string]: any };
  id: string;
  instanceHost: string;
  instanceId: string;
  machineRegionId: number;
  mytSdkServerEndpoint: string;
  mytSdkServerScheme: string;
  mytSdkServerUrl: string;
  platformUseStatus: number;
  recycleTime: number;
  rpaSdkServerEndpoint: string;
  rpaSdkServerScheme: string;
  runningContainerId: string;
  runningContainerIndex: number;
  runningContainerState: string;
  runningContainerStateMsg: string;
  softRoutingId: string;
  softRoute: string;
  status: number;
  tenantUseStatus: number;
  updatedAt: string;
  userDeviceId: string;
  [property: string]: any;
}

export interface ContainerListResult {
  cloudDeviceId: string;
  createdAt: string;
  data: string;
  host: string;
  id: string;
  index: number;
  name: string;
  state: string;
  stateMsg: string;
  updatedAt: string;
  [property: string]: any;
}
