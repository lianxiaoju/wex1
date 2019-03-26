const isArray = (obj) => Object.prototype.toString.call(obj) === '[object Array]';
const isObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]';
const isNumber = (obj) => Object.prototype.toString.call(obj) === '[object Number]';
const isBoolean = (obj) => Object.prototype.toString.call(obj) === '[object Boolean]';

const $ = {};

/**
 * 修改或添加键值对。
 * @param {String} key
 * @param {Object} value
 */
$.setItem = (key, value) => {
  if (isObject(value) || isArray(value)) {
    value = JSON.stringify(value);
  } else if (isNumber(value) || isBoolean(value)) {
    value = String(value);
  } else if (void 0 === value || value === null) {
    value = '';
  }
  wx.setStorageSync(key, value)
};

/**
 * 获取指定键的值。
 * @param {String} key
 * @param {Object} defaultVal （可选）当不存在指定键时，返回默认的值
 */
$.getItem = (key, defaultVal) => {
  let value = wx.getStorageSync(key);

  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (void 0 === value || value === null) {
    if (arguments.length > 1) {
      return defaultVal;
    } else {
      return null;
    }
  } else {
    try {
      value = JSON.parse(value);
    } catch (e) {
      return wx.getStorageSync(key);
    }
  }

  return value;
};
/**
 * 移除指定键。
 * @param {String} key
 */
$.removeItem = key => {
  wx.removeStorageSync(key)
};

/**
 * 清空所有键值对。
 */
$.clear = () => {
  wx.clearStorageSync()
};

/**
 * 获取所有键的集合。
 * @return {Array}
 */
$.keys = () => {
  const res = wx.getStorageInfoSync();
  return res.keys
};

export default $;
