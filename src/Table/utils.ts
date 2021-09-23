import { merge } from 'lodash-es';

const defaultStyle = {
  '--cell-border-vertical': 'none',
  '--header-cell-border': 'none',
  '--row-hover-color': 'transparent',
  overflow: 'auto',
  fontSize: '14px',
};

const themeProps: any = {
  dark: {
    '--bgcolor': '#222',
    '--color': '#ccc',
    '--header-color': '#20a0ff',
    '--header-bgcolor': '#222',
    '--border-color': '#3c3c3c',
  },
  default: {
    '--bgcolor': '#fff',
    '--color': 'rgba(0,0,0,.65)',
    '--header-color': 'rgba(0,0,0,.65)',
    '--header-bgcolor': '#f3f7fc',
    '--border-color': '#e6e6e6',
  },
};

const sizeProps: any = {
  small: {
    desktop: {
      '--header-row-height': '28px',
      '--row-height': '24px',
      '--table-font-size': '12px',
      defaultColumnWidth: 120,
    },
    mobile: {
      '--header-row-height': '22px',
      '--row-height': '20px',
      '--table-font-size': '12px',
      defaultColumnWidth: 60,
    },
  },
  default: {
    desktop: {
      '--header-row-height': '48px',
      '--row-height': '40px',
      '--table-font-size': '14px',
      defaultColumnWidth: 120,
    },
    mobile: {
      '--header-row-height': '26px',
      '--row-height': '24px',
      '--table-font-size': '12px',
      defaultColumnWidth: 80,
    },
  },
};

export const getPropsByType = (theme = 'default', size = 'default', device = 'desktop') => {
  let sizeProp = sizeProps[size] || sizeProps.default;
  sizeProp = sizeProp[device] || sizeProp.desktop;

  const { defaultColumnWidth, ...style } = merge(
    {},
    defaultStyle,
    themeProps[theme] || themeProps.default,
    sizeProp,
  );
  return { defaultColumnWidth, style };
};
