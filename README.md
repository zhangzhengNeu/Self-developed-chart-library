#rocket-chart

[TOC]

## 现有业务图表类型

### line

- line-basic
- line-autoSum
- line-doubleY
- line-autoOther
- line-maxTag
- line-markLine
- line-peak
- line-calendar
- line-regression
- line-smooth
- line-hideSymbol
- line-label

## 图表结构

```html
<Chart>
  <div>
    <Title />
    <Toolbar />
  <div>
  <CustomComponent />
  <ChartInstance />
  <Footer />
</Chart>
```

## 方法

```javascript
{
  init, getInstanceByDom, echarts;
}
```

## 使用方式

```javascript
import rocketChart from 'rocketChat';

//创建图表
const chartInstance = rocketChart.init({ dom, type, data });
//更新配置
chartInstance.setOption({ options });
//更新数据
chartInstance.updateData(data);
```

## 图表初始化参数项

- **dom**:HTMLDivElement
- **type**: string 图表业务类型,支持以 `&` 符号组合 'line-basic' | 'line-basic&line-autoSum'
- **data?**: 图表输入数据 [图表库数据输入标准](http://thoughts.ximalaya.com/workspaces/5cdcf22ebe825bee8c058170/docs/5d7a3702f30f870001953728)
- **formatters?**: 数据格式化方法;
- **chartOpts?**: `echart` 配置项，会覆盖默认生成配置
- **theme?**: object | string 主题文件，默认使用内置'default'
- **opts?**: `echart` [初始化附加参数](https://www.echartsjs.com/zh/api.html#echarts.init)
- **datasetParams?**: 业务图表内部数据转换方法参数
- **maxSymbolCount?**: `symbol`最大数量 默认 400
- **title?**: ReactElement | vueInstance | HTMLElement | string 图表标题组件
- **toolBar?**: ReactElement | vueInstance | HTMLElement | string 图表工具栏组件
- **customComponent?**: ReactElement | vueInstance | HTMLElement | string 图表自定义组件
- **footer?**: ReactElement | vueInstance | HTMLElement | string 图表底部组件

## 图表更新配置 参数

- **option**：拓展`echart`配置项
- **data**: 图表输入数据
- **lazyUpdate?**：
- **type?** 图表业务类型
- **datasetParams?** 业务图表内部数据转换方法参数
- **title?**: ReactElement | HTMLElement | string 图表标题组件
- **toolBar?**: ReactElement | HTMLElement | string 图表工具栏组件
- **customComponent?**: ReactElement | HTMLElement | string 图表自定义组件
- **footer?**: ReactElement | HTMLElement | string 图表底部组件

```javascript
option:{
  ...echart,
  // 自定义图形颜色 name字段名 color
  customerColor?:{name: color}
}
```

## 组件类型

```javascript
{
  title:(<div>react</div>),
  toolBar:new Vue({
    //不要指定el
    template: `<div>vue</div>`,
  }),
  customComponent:HTMLElement,
  footer:'string'
}
```

## `chartOpts`禁用参数

- **title**

## 图表 API

```
// 访问内部echart实例
chartInstance.echart
// 更新配置
chartInstance.setOption(options)
// 更新数据
chartInstance.updateData(data)
// 获取配置
chartInstance.getOption()
// 销毁
chartInstance.dispose()
// 生成图片（包含`title`、`footer`等组件）
chartInstance.getDataURL()
// 获取图表dom
chartInstance.getDom()
// 改变图表尺寸
chartInstance.resize({ width, height }: {
    width?: number | string;
    height?: number | string
})
// 获取尺寸
chartInstance.getWidth()
chartInstance.getHeight()
// 当前实例是否销毁
chartInstance.isDisposed()
```

## `echarts`相关操作

```javascript
//example
//全局echarts 注册主题
rocketChart.echarts.registerTheme('default', {});
//业务图表内部echarts 获取高度
chartInstance.echarts.getHeight();
```

## 性能

折线图`symbol`数量超过，内存占用会明显上升 暂定超过设定上限（默认 400）强制关闭

## formatters 数据格式化方法

```javascript
{
  date?: (data: any) => any;
  string?: (data: any) => any;
  number?: (data: any) => any;
};
```

## 业务图表参数

- **line-autoOther**: { mergeStart, mergeText }
- **line-markLine**: { type, name }
