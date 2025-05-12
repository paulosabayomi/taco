import { TChildRenderer } from "./child-proc/preload";
import { TRenderer } from "./preload";

declare global {
    interface Window {
        electron: TRenderer & TChildRenderer
    }
}