export interface List {
    key: string;
    name: string;
    value: string | number;
    icon?: string | Function;
    preRender?: 'percent' | 'number' | 'decimal' | Function;
  }
  
export interface BaseIndicatorProps {
    theme?: 'light' | 'dark';
    title?: string | Function;
    titleRight?: string | Function;
    cont: number | string | Function;
    unit?: string;
    compare?: string | Function | List[];
}

export interface ContList {
  key: string;
  name: string;
  value: string | number;
  unit?: string;
  preRender?: 'string' | 'percent' | 'number' | 'decimal' | Function;
  compare?: List[];
}

export interface MultiIndicatorProps {
  theme?: 'dark' | 'light';
  title?: string | Function;
  titleRight?: string | Function;
  cont: ContList[];
  unit?: string;
  compare?: string | Function | List[];
}