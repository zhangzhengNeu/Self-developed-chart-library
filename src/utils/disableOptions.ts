import { ChartOptions } from '../types';

const optionsList: (keyof ChartOptions)[] = ['title'];

export default function(target: ChartOptions) {
  optionsList.forEach(item => {
    if (target.hasOwnProperty(item)) {
      delete target[item];
    }
  });
}
