/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/26
 */


export declare namespace Hamter {
  type IPCRender = 'abc' | 'bbc';
  type IPCClient = 'bbb' | 'ccb';
  type CommunicationCallback = () => any;

  interface CommunicationClientInterface {
    channel: IPCClient;
    params?: any;
    callback?: CommunicationCallback;
  }

  interface CommunicationRenderInterface {
    channel: IPCRender;
    params?: any;
    callback?: CommunicationCallback;
  }

  interface CommunicationEventSet {
    [id: string]: CommunicationCallback;
  }


  interface ViewsStoreInterface {
    header: {
      title: string
    };
  }
}
