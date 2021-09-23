export default (str: string, maxLength = 20) => {
  const len = str.length;
  let chineseCharLen = 0;
  let enCharLen = 0;
  for (let i = 0; i < len; i++) {
    const charCode = str.charCodeAt(i);
    if (i >= maxLength) {
      enCharLen += 3;
      break;
    }
    if (charCode >= 0 && charCode <= 128) {
      enCharLen += 1;
    } else {
      chineseCharLen += 1;
    }
  }
  return {
    length: chineseCharLen * 2 + enCharLen,
    chineseCharLen,
    enCharLen,
  };
};
