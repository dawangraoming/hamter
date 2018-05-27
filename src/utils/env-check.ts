/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/27
 */

const env = process.env.NODE_ENV;

export const IS_DEV = env === 'development';
export const IS_PROD = env === 'production';
