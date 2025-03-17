export interface BaseEntityResult {
  createdAt: string;
  createdBy: string;
  deletedAt: null;
  deletedBy: string;
  updatedAt: string;
  updatedBy: string;
  id: string;
  [property: string]: any;
}

export interface BaseListParam {
  page: number;
  size: number;
  beginDate?: number; // 时间戳
  endDate?: number; // 时间戳
  word?: string;
}

export interface BaseListResult<T> {
  list: T[];
  total: number;
  [property: string]: any;
}

export enum EntityStatus {
  Normal = 1,
  Disable,
}
