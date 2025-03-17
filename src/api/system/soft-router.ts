import request from "@/utils/request";
import { BaseEntityResult, BaseListParam, BaseListResult, EntityStatus } from "../common";

const Soft_Router_BASE_URL = "/admin/soft-router";

const SoftRouterAPI = {
  list(data: SoftRouterListParam) {
    return request<any, BaseListResult<SoftRouterListResult>>({
      url: `${Soft_Router_BASE_URL}/list`,
      method: "post",
      data: data,
    });
  },
};

export default SoftRouterAPI;

export interface SoftRouterListParam extends BaseListParam {
  status?: EntityStatus.Normal;
}

export interface SoftRouterListResult extends BaseEntityResult {
  host: string;
  port: string;
}
