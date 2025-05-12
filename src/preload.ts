// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { TTask } from "./shared/types";

const renderer = {
    open_child_win: (data: TTask[]) => {
        ipcRenderer.send('open-child-win', data)
    },
    close_app: () => {
        ipcRenderer.send('close-app')
    }
}

contextBridge.exposeInMainWorld('electron', renderer)
export type TRenderer = typeof renderer