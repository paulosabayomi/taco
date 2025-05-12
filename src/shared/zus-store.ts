import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { IMainState, TTask } from './types'
// import type {} from '@redux-devtools/extension' // required for devtools typing



export const useMainState = create<IMainState>()(
//   devtools(
    persist(
      (set) => ({
        tasks: [] as TTask[],
        set_state: (title, value) => {
            switch (title) {
                case 'tasks':
                        set(() => ({ tasks: value }))
                    break;
            
                default:
                    break;
            }
        },
      }),
      {
        name: 'main-state',
      },
    ),
//   ),
)