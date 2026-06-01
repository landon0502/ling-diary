export interface AIModel {
  id: number;
  platform_id: number;
  value: string;
  label: string;
}

export interface AIPlatform {
  id: number;
  name: string;
  label: string;
  auth_url: string;
  models: AIModel[];
}

export interface UserAiConfig {
  model: string;
  platform: string;
  auth_url: string;
  api_key: string;
}
