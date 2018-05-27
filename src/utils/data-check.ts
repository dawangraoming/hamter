/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/5/27
 */

function objectToString(data: any) {
  return Object.prototype.toString.call(data);
}

/**
 * 判断数据是否数组类型
 * @param data
 * @returns {boolean}
 */
export function isArray(data: any) {
  return objectToString(data) === '[object Array]';
}

/**
 * 判断数据是否string类型
 * @param data
 * @returns {boolean}
 */
export function isString(data: any) {
  return objectToString(data) === '[object String]';
}

/**
 * 判断数据是否number类型
 * @param data
 * @returns {boolean}
 */
export function isNumber(data: any) {
  return objectToString(data) === '[object Number]';
}

/**
 * 判断数据是否object类型
 * @param data
 * @returns {boolean}
 */
export function isObject(data: any) {
  return objectToString(data) === '[object Object]';
}

/**
 * 判断数据是否function
 * @param data
 * @returns {boolean}
 */
export function isFn(data: any) {
  return objectToString(data) === '[object Function]';
}
