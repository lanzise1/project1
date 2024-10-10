import customFetch from "./request";

interface StaticConfigurationData {
  themes: TthemesItem[];
}

export interface TthemesItem {
  name: string;
  id: string;
}
export const staticConfigurationApi = () => {
  return customFetch.get<TResponse<StaticConfigurationData>>(
    "/api/static_configuration"
  );
};
