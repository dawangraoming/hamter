/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/7/23
 */


declare module 'psd' {
  interface OpenReturn {
    image: {
      saveAsPng: (path: string) => Promise<any>
    };
  }


  export function open(path: string): Promise<OpenReturn>;
}
