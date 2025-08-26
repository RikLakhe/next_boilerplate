export interface AppMenuInterface {
  key: string;
  label?: string;
  path?: string;
  icon?: React.ReactNode;
  subMenu?: {
    key: string;
    label: string;
    path?: string;
    icon?: React.ReactNode;
  }[];
}

export interface AdminMenuInterface {
  key: string;
  label?: string;
  path?: string;
  subMenu?: {
    key: string;
    label: string;
    path?: string;
  }[];
}

export interface MasterDataMenuInterface {
  key: string;
  label?: string;
  subMenu?: {
    key: string;
    label: string;
  }[];
}
