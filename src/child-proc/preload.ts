// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { broadcast_event } from "../shared/functions";


ipcRenderer.on('tasks-data', (ev, data) => {
    console.log("data gotten", data);    
    broadcast_event('data-tasks', data)
})

const renderer = {
    // open_child_win: (data: TTask) => {
    //     ipcRenderer.send('open-child-win', data)
    // }
}

contextBridge.exposeInMainWorld('electron', renderer)
export type TChildRenderer = typeof renderer