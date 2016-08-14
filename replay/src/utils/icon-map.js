/* eslint-disable no-param-reassign, global-require */
const fileList = require.context('_icons', true, /[\s\S]*$/);

const iconMap = {};
fileList.keys().forEach(x => {
  x = x.replace('./', '');
  iconMap[x.replace('.svg', '')] = require(`_icons/${x}`);
});

export default iconMap;
