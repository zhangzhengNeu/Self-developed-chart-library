import React from 'react';
import ReactDom from 'react-dom';
import echarts, { ECharts } from 'echarts';
import html2canvas from 'html2canvas';
import Table from './Table';
import Card from './Card';
import BasicRocketIndicator from './Indicator/index';
import MultiRocketIndicator from './Indicator/multiCard';
import { FunnelColumn } from './Funnel';
import NoData from './NoData';
import { merge, cloneDeep, isObject, isEqual } from 'lodash-es';
import { ChartProps, ChartOptions, Data, SetOption } from './types';
import { checkSymbolCount, dataFormate, customDraw, disableOptions, isMobile } from './utils';
import generateConfigByType, { registerType } from './utils/generateConfigByType';
import { toDataset } from './utils/transfer';
import getMap from './utils/getMap';
import { initPlugin, disposePlugin, updatePlugin } from './utils/plugins';
import { timeAxis, labelFormat, tooltip, generateLegendConfig, customListener } from './global';
import themes from './theme';
import mobileTheme from './theme/mobile';
import defaultChartOption from './defaultChartOption';
import './styles/index.scss';

const reactUnmount = ReactDom.unmountComponentAtNode;
const reactRender = ReactDom.render;

// registerTheme
for (const name in themes) {
  echarts.registerTheme(name, themes[name]);
}

const DOM_ATTRIBUTE_KEY = '_rocketchart-instance_';
const customPluginMap: any = {};

const instances: { [key: string]: Chart } = {};
class Chart {
  private disposed = false;
  private chartProps: ChartProps;
  private id = '';
  private chartPropsFromTypes: Partial<ChartProps> = {};
  private datasetHandler: (dataset: any, params: any, props: any) => ChartOptions = () => ({});
  plugins: Array<any> = [];
  chartOptions: ChartOptions = {};
  echart!: ECharts;
  resizeHandler: [] = [];

  constructor(chartProps: ChartProps) {
    const device = chartProps.device || (isMobile() ? 'mobile' : 'desktop');
    this.chartProps = { ...chartProps, device };
    this.init();
  }

  private init() {
    const {
      dom,
      type,
      option = {},
      data,
      theme = 'default',
      title,
      customComponent,
      footer,
      toolBar,
      plugins,
      subTitle,
    } = this.chartProps;
    const id = +new Date() + '';
    dom.setAttribute(DOM_ATTRIBUTE_KEY, id);
    const classList = theme === 'dark' ? ['rocketChart', 'rocketChart-dark'] : ['rocketChart'];

    dom.classList.add(...classList);

    dom.innerHTML = `
      <div class="rocketChart-top">
        <div class="rocketChart-title"></div>
        <div class="rocketChart-toolBar"></div>
      </div>
      <div class="rocketChart-subTitle"></div>
      <div class="rocketChart-customComponent"></div>
      <div class="rocketChart-instance"></div>
      <div class="rocketChart-domInstance"></div>
      <div class="rocketChart-footer"></div>
    `;

    this.id = id;
    this.setOption({
      type,
      option,
      data,
      title,
      customComponent,
      footer,
      subTitle,
      toolBar,
      plugins,
    });
    instances[id] = this;
  }

  get isDoubleY() {
    return this.chartProps.type.includes('doubleY');
  }

  get isTable() {
    return this.chartProps.type.includes('table');
  }

  get isIndicator() {
    return this.chartProps.type.startsWith('indicator');
  }

  get isFunnelColumn() {
    return this.chartProps.type.includes('funnel-column');
  }

  get isCard() {
    return this.chartProps.type.includes('card');
  }

  get isEChart() {
    return !(this.isTable || this.isIndicator || this.isFunnelColumn || this.isCard);
  }

  private onChangeType = (type: string) => {
    const { defaultChartProps, datasetHandler, resizeHandler } = generateConfigByType(type);
    const chartEl = this.chartProps.dom.querySelector<HTMLDivElement>('.rocketChart-instance')!;
    const domEl = this.chartProps.dom.querySelector<HTMLDivElement>('.rocketChart-domInstance')!;
    this.chartProps.type = type;

    if (this.isEChart) {
      reactUnmount(chartEl);
      chartEl.style.display = 'block';
      domEl.style.display = 'none';
      this.initEchart();
    } else {
      this.disposeEchart();
      domEl.style.display = 'block';
      chartEl.style.display = 'none';
    }
    this.resizeHandler = resizeHandler;
    this.chartPropsFromTypes = defaultChartProps;
    this.datasetHandler = datasetHandler;
  };

  private initEchart = () => {
    const { dom, opts, theme = 'default', device, plugins } = this.chartProps;
    let t = theme;

    if (device === 'mobile') {
      t = typeof theme === 'string' ? merge({}, themes[theme], mobileTheme) : theme;
    }

    if (!this.echart || this.echart.isDisposed()) {
      this.echart = echarts.init(
        dom.getElementsByClassName('rocketChart-instance')[0] as HTMLDivElement,
        t,
        opts,
      );
      this.bindChartEvent();
      this.plugins = initPlugin(this.chartProps.plugins, dom, this, customPluginMap);
    }
  };

  initPlugin = (plugins: Array<any>) => {
    const { dom } = this.chartProps;
    this.plugins = initPlugin(plugins, dom, this, customPluginMap);
  };

  private bindChartEvent = () => {
    const reverseSelect = this.chartProps.datasetParams?.$legend?.reverseSelect;
    customListener.triggerCustomListener(this.echart);
    customListener.triggerTooltipListener(this.echart);
    customListener.triggerLegendSelect(this.echart, reverseSelect);
  };

  private renderComponent = async (componentObj: object = {}) => {
    const list = Object.entries(componentObj);
    await list.forEach(([type, component]) => {
      const className = `.rocketChart-${type}`;
      const container = this.chartProps.dom.querySelector<HTMLElement>(className);
      const olderComponent = this.chartProps[type];
      if (this.disposed || !container) {
        return;
      }

      // clear olderComponent
      if (olderComponent) {
        if (React.isValidElement(olderComponent)) {
          !React.isValidElement(component) && reactUnmount(container);
        } else if (olderComponent._isVue && olderComponent.$el) {
          olderComponent.$destroy();
          olderComponent.$el.remove();
        } else {
          container.innerHTML = '';
        }
      }
      this.chartProps[type] = component;

      if (!component) {
        return;
      }

      // string || HTMLElement
      if (typeof component === 'string' || component instanceof HTMLElement) {
        container.innerHTML = '';
        container.append(component);
        return;
      }

      // React element
      if (React.isValidElement(component)) {
        reactRender(component, container);
        return;
      }

      // vue element
      if (component._isVue) {
        const root = document.createElement('div');
        container.append(root);
        component.$mount(root);
        return;
      }
    });
    this.resize();
  };

  private getChartOptionsByData = (data: Data = { target: [], source: [], type: '' }) => {
    const formatedData = dataFormate(data, this.chartProps.formatters);
    const dataset = toDataset(formatedData);
    if (isEqual(dataset.source, [])) {
      return { dataset: { source: [] } };
    }
    const { theme = 'default' } = this.chartProps;
    const props = {
      themeConfig: typeof theme === 'string' ? themes[theme] : theme,
    };
    const options = this.datasetHandler(
      dataset,
      merge({}, this.chartPropsFromTypes.datasetParams, this.chartProps.datasetParams),
      props,
    );

    return options;
  };

  /**
   * 不依赖chartOpts参数计算的option
   * @param chartOptions
   * @param datasetParams
   * @param data
   */
  private getGlobalOption = (chartOptions: ChartOptions, datasetParams: any, data?: Data) => {
    // 判断是否有数据
    if (!this.hasData(data)) return {};
    // 背景色
    if (this.chartProps.dom) {
      this.chartProps.dom.style.backgroundColor = datasetParams?.$backgroundColor || '';
    }
    // label格式化
    const labelConfig = labelFormat(chartOptions, datasetParams, data, this.isDoubleY);

    // 初始：axisLabel、seriesLabel格式化
    const optionList: any[] = [labelConfig.config];

    if (this.isEChart) {
      // tooltip formatter
      const tooltipOption = tooltip.tooltipFormatter(
        chartOptions,
        merge({}, { $tooltip: labelConfig.$tooltip }, datasetParams),
      );

      // 图例位置
      const legendConfig = generateLegendConfig(chartOptions, datasetParams?.$legend);
      optionList.push(tooltipOption, legendConfig);
    }

    return merge({}, ...optionList);
  };

  /**
   * 依赖所有参数计算的option
   * @param chartOptions
   * @param datasetParams
   * @param data
   */
  private getLastOption = () => {
    const { chartOptions, chartProps } = this;
    const { data, datasetParams } = chartProps;

    if (!this.echart || !this.hasData(data)) return {};

    const options = merge(
      {},
      // 时间轴格式化
      timeAxis(chartOptions, datasetParams, this.echart),
    );

    merge(this.chartOptions, options);
  };

  /**
   * 是否有数据
   */
  private hasData = (data?: Data) => {
    return !(!data || !data.source || !data.target || !data.source.length || !data.target.length);
  };

  private renderTable = () => {
    const { dom, theme, device } = this.chartProps;
    const container = dom.querySelector<HTMLDivElement>(
      '.rocketChart-domInstance',
    ) as HTMLDivElement;
    const tableInstance = React.createElement(Table, {
      tableProps: this.chartOptions.table as any,
      container,
      theme,
      device,
      type: this.chartProps.type,
    });
    reactRender(tableInstance, container);
  };

  /**
   * 绘制dom类型图表
   */
  private renderDomChart = () => {
    const { dom, theme, type, datasetParams, data, device, option } = this.chartProps;
    const colors = typeof theme === 'string' ? themes[theme]?.color : themes.default.color;
    const container = dom.querySelector<HTMLDivElement>(
      '.rocketChart-domInstance',
    ) as HTMLDivElement;

    let chartProp: any = {
      theme,
      type,
      datasetParams,
      data,
      device,
      chartOptions: this.chartOptions,
      colors,
    };
    let chartDom: any = null;

    switch (true) {
      case this.isTable:
        chartDom = Table;
        chartProp = {
          tableProps: this.chartOptions.table as any,
          container,
          theme,
          device,
          type: this.chartProps.type,
        };
        break;
      case this.isIndicator:
        chartDom = type === 'indicator-basic' ? BasicRocketIndicator : MultiRocketIndicator;
        break;
      case this.isCard:
        chartDom = Card;
        break;
      case this.isFunnelColumn:
        chartDom = FunnelColumn;
        const hideSymbol = this.chartProps.type.includes('funnel-hideSymbol');
        chartProp.hideSymbol = hideSymbol;
        chartProp.option = { ...(device === 'mobile' ? mobileTheme : {}), ...option };
        break;
      default:
    }

    const chartInstance = React.createElement(chartDom, chartProp);
    reactRender(chartInstance, container);
  };

  setOption = ({
    option,
    notMerge = false,
    lazyUpdate = false,
    type = '',
    data,
    datasetParams,
    plugins,
    ...components
  }: SetOption) => {
    // 不合并option
    if (notMerge) {
      this.chartProps.datasetParams = datasetParams;
      this.chartProps.option = option;
    } else {
      this.chartProps = merge({}, this.chartProps, {
        datasetParams,
        option: option,
      });
    }
    if (type) {
      this.onChangeType(type);
    }

    if (
      isMobile() &&
      !(
        type.includes('pie') ||
        type.includes('funnel') ||
        type.includes('table') ||
        type.includes('map')
      )
    ) {
      option = merge(option, { tooltip: { triggerOn: 'none' } });
    }
    data && (this.chartProps.data = data);

    // 需要重新计算data
    if (type || data || datasetParams) {
      notMerge = true;
      const dataForGraph = { ...this.chartProps.data, type: this.chartProps.type };
      const optionFromData = this.getChartOptionsByData(dataForGraph); //传type 为兼容关系图
      this.chartOptions = merge(
        {},
        defaultChartOption,
        this.chartPropsFromTypes.option,
        optionFromData,
        this.chartProps.option,
        // option,
      );
      const globalOption = this.getGlobalOption(
        this.chartOptions,
        merge({}, this.chartPropsFromTypes.datasetParams, this.chartProps.datasetParams),
        this.chartProps.data,
      );
      merge(this.chartOptions, globalOption, option);
    } else if (option) {
      this.chartOptions = notMerge
        ? merge({}, defaultChartOption, option)
        : merge(this.chartOptions, option);
    }

    disableOptions(this.chartOptions);

    // TODO: hack YAxis scale max 配置冲突导致样式错乱
    if (type.includes('autoYAxis') && this.chartOptions.yAxis) {
      // yAxis[]
      if (
        Array.isArray(this.chartOptions.yAxis) &&
        this.chartOptions.yAxis.find((item) => item.max)
      ) {
        this.chartOptions.yAxis.forEach((item) => delete item.scale);
      }
      // yAxis
      if (isObject(this.chartOptions.yAxis) && this.chartOptions.yAxis.max) {
        delete this.chartOptions.yAxis.scale;
      }
    }
    this.renderComponent(components);

    if (!this.isEChart) {
      this.renderDomChart();
    } else {
      checkSymbolCount(this.chartOptions, this.chartProps.maxSymbolCount);
      this.renderChart(notMerge, lazyUpdate);
    }
    this.echart && updatePlugin(this.plugins, plugins);
  };

  private renderChart = async (notMerge: boolean, lazyUpdate: boolean) => {
    const type = this.chartOptions;

    // 通用功能配置，覆盖用户设置
    this.getLastOption();

    this.setCustomerColor();
    if (this.chartProps.type.includes('map-')) {
      await this.loadMap();
    }

    this.echart.setOption(this.chartOptions, notMerge, lazyUpdate);
    this.echart.resize();
  };

  private renderNoData = async () => {
    const { dom, datasetParams } = this.chartProps;

    const empty = datasetParams?.empty;

    const container = dom.querySelector<HTMLDivElement>('.rocketChart-instance');
    const noDataInstance = React.createElement(NoData, { empty });

    reactRender(noDataInstance, container);
  };

  private clearComponents() {
    this.renderComponent({
      title: null,
      toolBar: null,
      customComponent: null,
      footer: null,
      subTitle: null,
    });
  }

  private setCustomerColor = () => {
    const { customerColor, series } = this.chartOptions;
    if (!customerColor || !series) {
      return;
    }
    const { dataset } = this.chartOptions as any;
    const orderList = dataset.source.slice(1);
    Object.entries(customerColor).forEach(([name, color]) => {
      const index = orderList.findIndex((item: any) => item[0] === name);
      const target = series[index] as any;
      target && (target.itemStyle = merge({}, target.itemStyle, { color }));
    });
  };

  /**
   * 加载高德地图geoJson
   */
  private loadMap = async () => {
    if (!this.chartProps.type.includes('map-')) {
      return;
    }
    const { dataset } = this.chartOptions;
    const { datasetParams = {} } = this.chartProps;
    const mapType = datasetParams?.basic?.mapType || datasetParams.mapType;
    const locationList = dataset.source[0];

    this.echart.showLoading('default', { text: '地图加载中...' });
    try {
      const geoJson = await getMap(mapType);
      for (let i = 1; i < locationList.length; i++) {
        const adcode = locationList[i];
        const item = geoJson.features.find((item: any) => item.properties.adcode === adcode);
        item && (locationList[i] = item.properties.name);
      }
    } finally {
      this.echart.hideLoading();
    }
  };

  /**
   * 创建标注
   * position: 位置
   * text: 文字
   */
  public createDataMaker = ({
    position = [0, 0],
    text = '',
    point = {},
    bottom = false,
    trigger = 'always',
  }) => {
    const { series } = this.chartOptions as any;
    if (series) {
      const newSeries = series?.concat({
        type: 'custom',
        name: '标注',
        zlevel: 1,

        encode: {
          x: -1,
          y: 1,
        },
        renderItem: (params: any, api: any) =>
          customDraw.renderDrawItem(api, text, point, bottom, trigger),
        data: trigger === 'click' ? [[...position, text]] : [position],
      });
      this.setOption({
        option: {
          series: newSeries,
        },
      });
    }
  };

  updateData = (data: Data = { target: [], source: [] }) => {
    this.setOption({ data, option: {} });
  };

  mergePlugin = (options = {}) => {
    if (this.disposed) {
      return;
    }
    this.echart.setOption(options, false);
  };

  disposeEchart = () => {
    if (this.echart) {
      // 注销移动端tooltip监听z
      customListener.disposeTooltipListener(this.echart);
      this.echart.dispose();
      (this as any).echart = null;
    }
  };

  dispose = () => {
    if (this.disposed) {
      return;
    }
    // 卸载插件
    disposePlugin(this.plugins);

    const dom = this.chartProps.dom;
    reactUnmount(dom.getElementsByClassName('rocketChart-domInstance')[0]);

    this.disposeEchart();
    this.clearComponents();

    dom.removeAttribute(DOM_ATTRIBUTE_KEY);
    dom.classList.remove('rocketChart', 'rocketChart-dark');
    // dom.innerHTML = '';
    this.disposed = true;
    delete instances[this.id];
  };

  clear = () => {
    if (this.disposed) {
      return;
    }

    this.clearComponents();

    this.chartOptions.series = [];
    this.chartOptions.dataset = [];
    this.echart?.clear();
  };

  getDataURL = () => {
    const { title } = this.chartProps;
    html2canvas(this.chartProps.dom).then(function (canvas: HTMLCanvasElement) {
      const filename = typeof title === 'string' ? title : +new Date();
      const img = document.createElement('a');
      img.download = `${filename}.jpeg`;
      img.href = canvas.toDataURL();
      img.click();
    });
  };

  resize = ({ width, height }: { width?: number | string; height?: number | string } = {}) => {
    width && (this.chartProps.dom.style.width = `${width}px`);
    height && (this.chartProps.dom.style.height = `${height}px`);

    if (this.isTable) {
      this.renderTable();
    }

    if (this.echart) {
      this.echart.resize();
      if (this.resizeHandler) {
        this.resizeHandler.forEach((Handler: any) => {
          Handler(this.echart, this.chartOptions, this.chartProps);
        });
      }
    }
  };

  getOption = () => {
    const { type } = this.chartProps;
    const { table } = this.chartOptions;
    const option = this.echart && this.echart.getOption();
    return cloneDeep({ type, ...option, table });
  };

  getDom = () => this.chartProps.dom;
  getWidth = () => this.chartProps.dom.offsetWidth;
  getHeight = () => this.chartProps.dom.offsetHeight;
  isDisposed = () => this.disposed;
}

function registerPlugin(name: string, type: any) {
  customPluginMap[name] = type;
}

function getInstanceByDom(dom: HTMLDivElement) {
  const id = dom.getAttribute(DOM_ATTRIBUTE_KEY);
  return id ? instances[id] : null;
}

function init(chartProps: ChartProps) {
  const { dom } = chartProps;
  const instance = getInstanceByDom(dom);
  return instance || new Chart(chartProps);
}

export default {
  init,
  getInstanceByDom,
  echarts,
  registerPlugin,
  registerType,
};
