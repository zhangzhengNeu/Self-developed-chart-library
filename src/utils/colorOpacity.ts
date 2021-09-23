const colorOpacity = (defaultColor: any, opacity: any = 0) => {
  const rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;

  const rgbaRegex = /^rgba?\(((25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,\s*?){2}(25[0-5]|2[0-4]\d|1\d{1,2}|\d\d?)\s*,?\s*([01]\.?\d*?)?\)$/;

  const hexRegex = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;

  const rgbaToRgb = (color: any) => {
    let rgbaAttr = color.match(/[\d.]+/g);
    if (rgbaAttr.length >= 3) {
      var r, g, b;
      r = rgbaAttr[0];
      g = rgbaAttr[1];
      b = rgbaAttr[2];
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    return '';
  };

  const rgbToRgba = (color: any, opacity: Number) => {
    let rgbaAttr = color.match(/[\d.]+/g);
    if (rgbaAttr.length >= 3) {
      let r, g, b;
      r = rgbaAttr[0];
      g = rgbaAttr[1];
      b = rgbaAttr[2];
      return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }
  };

  /* 十六进制颜色值转为带透明度的颜色
   * @param _color 十六进制颜色
   * @param _opacity 透明度
   * @returns {string} rgba
   */
  const hexToRgba = (color: any, opacity: Number) => {
    var sColor = color.toLowerCase();
    //十六进制颜色值的正则表达式
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        var sColorNew = '#';
        for (var i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      var sColorChange = [];
      for (var i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
      }
      return 'rgba(' + sColorChange.join(',') + ',' + opacity + ')';
    }
    return sColor;
  };

  let rgba;
  if (rgbRegex.test(defaultColor)) {
    rgba = rgbToRgba(defaultColor, opacity);
  } else if (rgbaRegex.test(defaultColor)) {
    const a = rgbaToRgb(defaultColor);
    rgba = rgbToRgba(a, opacity);
  } else if (hexRegex.test(defaultColor)) {
    rgba = hexToRgba(defaultColor, opacity);
  }
  return rgba;
};

export default colorOpacity;
