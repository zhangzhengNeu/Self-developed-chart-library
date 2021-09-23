import echarts, { ECharts } from 'echarts';

const mapDatas: any = {};
let uiLoader: Promise<any>;
const mapLoaders: Record<string | number, any> = {};
let districtExplorer: any = null;

const getDistrictExplorer = () => {
  uiLoader = new Promise((resolve, reject) => {
    districtExplorer && resolve(districtExplorer);
    const url = '//webapi.amap.com/ui/1.1/main.js';
    const el = document.createElement('script');
    el.type = 'text/javascript';
    document.head.append(el);
    el.onload = () => {
      (window as any).AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer: any) => {
        districtExplorer = new DistrictExplorer();
        resolve(districtExplorer);
      });
    };
    el.onerror = () => reject('加载失败');
    el.src = url;
  });
  return uiLoader;
};

const getMap = async (adcode: string) => {
  if (mapLoaders[adcode]) {
    return mapLoaders[adcode];
  }
  const explorer = uiLoader ? await uiLoader : await getDistrictExplorer();

  const loader = new Promise(async (resolve, reject) => {
  
    explorer.loadAreaNode(adcode, (err: any, areaNode: any) => {
      if (err) {
        return reject(err);
      }
      if (!areaNode) {
        return reject('查询结果空');
      }
      !areaNode && reject('查询结果空');
      const data = {
        type:"FeatureCollection",
        features:areaNode.getSubFeatures()
      }
      mapDatas[adcode] = data;
      echarts.registerMap(adcode, data);
      resolve(data);
    });
  });
  mapLoaders[adcode] = loader;
  return loader;
};


export default getMap;

