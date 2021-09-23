import defaultTheme from './default';
import light from './light';
import retro from './retro';
import dark from './dark';

/**
 *
 * default 配色同g2
 *
 * light 配色同神策
 *
 * retro 配色同tableau
 *
 * dark 暗黑模式
 */
const themes: { [key: string]: any } = {
  default: defaultTheme,
  light,
  retro,
  dark: dark,
};

export default themes;
