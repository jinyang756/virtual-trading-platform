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
