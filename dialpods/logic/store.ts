import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {useShallow} from 'zustand/shallow';
import type {Podcasts} from './types/types';

interface UIState {
  subs: Podcasts;
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
    subs: {},
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
