export interface Action {
  id: string;
  type: string;
  query: string;
  timestamp: string;
  output?: string;
}

export interface MarkdownJob {
  id: string;
  url: string;
  proxy_location: string | null;
  state: string;
  credit_usage: number;
  http_status_code: number;
  from_cache: boolean;
  started_at: string;
  completed_at: string;
  running_time: string;
  page_load_time: string;
  actions: Action[];
}

export interface MarkdownRequestSettingsAction {
  type: string;
  selector?: string;
  timeout?: number;
  continue_on_fail?: boolean;
}

export interface MarkdownRequestSettings {
  record_request: boolean;
  actions: MarkdownRequestSettingsAction[];
}

export interface MarkdownRequest {
  url: string;
  proxy_location: string | null;
  async: boolean;
  max_cache_age: number;
  settings: MarkdownRequestSettings;
}

export interface UserCount {
  count: number;
  expiredAt: number;
}
