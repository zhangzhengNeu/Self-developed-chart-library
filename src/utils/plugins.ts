function initPlugin(plugins: any, dom: any, cxt: any, customPluginMap: any) {
  const pluginMap: any = {};
  if (!plugins?.length) return pluginMap;
  plugins.forEach((item: any) => {
    const { name, option } = item || {};
    const plugin = customPluginMap[name];
    pluginMap[name] = plugin && plugin.init(cxt, dom, option);
  });

  return pluginMap;
}

function disposePlugin(plugins: any) {
  if (!plugins) return;
  Object.values(plugins).forEach((plugin: any) => {
    plugin.dispose && plugin.dispose();
  });
}

function updatePlugin(plugins: any, options: any) {
  if (plugins?.length) return;
  Object.entries(plugins).forEach(([name, plugin]) => {
    plugin.setOption && plugin.setOption(options?.find((i: any) => i.name === name)?.option);
  });
}

export { initPlugin, disposePlugin, updatePlugin };
