import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {useShallow} from 'zustand/shallow';
import type {Podcasts} from './types/types';
import {fetchState} from './api';

interface UIState {
  url: string;
  setURL: (url: string) => void;
  cookie: string;
  setCookie: (coki: string) => void;
  subs: Podcasts;
  sync: () => Promise<void>;
}
type ProcessState = {subs: Podcasts};
type WsMessage =
  | {kind: 'error'; data: string}
  | {
      kind: 'state';
      data: ProcessState;
    };
// | {
//       kind: 'post';
//       data: Post['data'];
//       stream_name: string;
//       post_id: string;
//   }
// | {
//       kind: 'image';
//       data: {
//           image: string;
//           uri: string;
//       };
//   }
// | {
//       kind: 'profile';
//       data: CuratorProfileInfo;
//   };
const storeInner = create<UIState>()(
  // persist(
  (set, get) => ({
    url: '',
    setURL: url => set({url}),
    cookie: '',
    setCookie: cookie => set({cookie}),
    subs: {},
    sync: async () => {
      const res = await fetchState();
      if ('ok' in res) set({subs: res.ok});
    },
  }),
  //     {
  //         name: 'dial_pods_store',
  //         storage: createJSONStorage(() => sessionStorage),
  //     },
  // ),
);

const useUIStore = <T extends (state: UIState) => any>(
  selector: T,
): ReturnType<T> => storeInner(useShallow(selector));

export default useUIStore;
