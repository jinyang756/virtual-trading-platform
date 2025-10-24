/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: object;
  error?: {
    code?: string;
    message?: string;
  };
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  balance?: number;
  role?: string;
}

export interface Fund {
  fund_id?: string;
  name?: string;
  fund_manager?: string;
  risk_level?: string;
  nav?: number;
  min_investment?: number;
  management_fee?: number;
  performance_fee?: number;
  total_return?: number;
  /** @format date-time */
  update_time?: string;
}

export interface Trade {
  id?: string;
  user_id?: string;
  symbol?: string;
  quantity?: number;
  price?: number;
  amount?: number;
  fee?: number;
  status?: string;
  /** @format date-time */
  timestamp?: string;
}

export interface Position {
  id?: string;
  user_id?: string;
  symbol?: string;
  quantity?: number;
  average_price?: number;
  current_price?: number;
  market_value?: number;
  profit_loss?: number;
  /** @format date-time */
  timestamp?: string;
}

export interface Workflow {
  id?: string;
  name?: string;
  description?: string;
  type?: string;
  status?: string;
  created_by?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

export interface Task {
  id?: string;
  workflow_id?: string;
  name?: string;
  status?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "http://localhost:3001",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title 虚拟交易平台 API
 * @version 1.0.0
 * @baseUrl http://localhost:3001
 *
 * 虚拟交易平台的完整API文档
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @name UsersLoginCreate
     * @summary 用户登录
     * @request POST:/api/users/login
     */
    usersLoginCreate: (
      data: {
        username?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: {
            token?: string;
            userId?: string;
            username?: string;
          };
        },
        any
      >({
        path: `/api/users/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersRegisterCreate
     * @summary 用户注册
     * @request POST:/api/users/register
     */
    usersRegisterCreate: (
      data: {
        username?: string;
        email?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: {
            userId?: string;
          };
        },
        any
      >({
        path: `/api/users/register`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersProfileList
     * @summary 获取用户信息
     * @request GET:/api/users/profile
     */
    usersProfileList: (params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: User;
        },
        any
      >({
        path: `/api/users/profile`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name UsersProfileUpdate
     * @summary 更新用户信息
     * @request PUT:/api/users/profile
     */
    usersProfileUpdate: (
      data: {
        username?: string;
        email?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: User;
        },
        any
      >({
        path: `/api/users/profile`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name FundList
     * @summary 获取所有基金信息
     * @request GET:/api/fund/
     */
    fundList: (params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: Fund[];
        },
        any
      >({
        path: `/api/fund/`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name FundDetail
     * @summary 获取特定基金信息
     * @request GET:/api/fund/{fundId}
     */
    fundDetail: (fundId: string, params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: Fund;
        },
        any
      >({
        path: `/api/fund/${fundId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name FundNavHistoryList
     * @summary 获取基金净值历史
     * @request GET:/api/fund/{fundId}/nav-history
     */
    fundNavHistoryList: (
      fundId: string,
      query?: {
        /** @format date */
        startDate?: string;
        /** @format date */
        endDate?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: {
            /** @format date */
            date?: string;
            nav?: number;
            change?: number;
          }[];
        },
        any
      >({
        path: `/api/fund/${fundId}/nav-history`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name TradeContractOrderCreate
     * @summary 下合约订单
     * @request POST:/api/trade/contract/order
     */
    tradeContractOrderCreate: (
      data: {
        symbol?: string;
        quantity?: number;
        leverage?: number;
        side?: "buy" | "sell";
        stopLoss?: number;
        takeProfit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: {
            orderId?: string;
            symbol?: string;
            quantity?: number;
            leverage?: number;
            side?: string;
            price?: number;
            /** @format date-time */
            timestamp?: string;
          };
        },
        any
      >({
        path: `/api/trade/contract/order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name TradeContractPositionsList
     * @summary 获取用户持仓
     * @request GET:/api/trade/contract/positions
     */
    tradeContractPositionsList: (params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: Position[];
        },
        any
      >({
        path: `/api/trade/contract/positions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WorkflowCreate
     * @summary 创建工作流
     * @request POST:/api/workflow
     */
    workflowCreate: (
      data: {
        name?: string;
        description?: string;
        workflowType?: string;
        config?: object;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: Workflow;
        },
        any
      >({
        path: `/api/workflow`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WorkflowList
     * @summary 获取工作流列表
     * @request GET:/api/workflow
     */
    workflowList: (
      query?: {
        /** @default 1 */
        page?: number;
        /** @default 10 */
        limit?: number;
        status?: string;
        type?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        ApiResponse & {
          data?: {
            workflows?: Workflow[];
            pagination?: {
              page?: number;
              limit?: number;
              totalCount?: number;
              totalPages?: number;
            };
          };
        },
        any
      >({
        path: `/api/workflow`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WorkflowDetail
     * @summary 获取工作流详情
     * @request GET:/api/workflow/{id}
     */
    workflowDetail: (id: string, params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: {
            workflow?: Workflow;
            tasks?: Task[];
          };
        },
        any
      >({
        path: `/api/workflow/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WorkflowStartCreate
     * @summary 启动工作流
     * @request POST:/api/workflow/{id}/start
     */
    workflowStartCreate: (id: string, params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: {
            id?: string;
            status?: string;
            /** @format date-time */
            updatedAt?: string;
          };
        },
        any
      >({
        path: `/api/workflow/${id}/start`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WorkflowCancelCreate
     * @summary 取消工作流
     * @request POST:/api/workflow/{id}/cancel
     */
    workflowCancelCreate: (id: string, params: RequestParams = {}) =>
      this.request<
        ApiResponse & {
          data?: {
            id?: string;
            status?: string;
            /** @format date-time */
            updatedAt?: string;
          };
        },
        any
      >({
        path: `/api/workflow/${id}/cancel`,
        method: "POST",
        format: "json",
        ...params,
      }),
  };
}
