import React from "react";
import { ArrowDown, ArrowUp, Pen, Plus, X } from "lucide-react";
import { TTask } from "./types";
import { friendlyTime } from "./functions";

export const TaskList = React.memo((props: {data: TTask, index: number, rmCb: Function, editCb: Function, totalItems: number, moveUpCb: Function, moveDwCb: Function}) => {
    const time = friendlyTime(props.data.duration)
    return (
        <div className="flex flex-row justify-between items-start pb-2">
            <div className="flex flex-col flex-1">
                <div className="font-semibold">{props.data.title}</div>
                <div className="opacity-70">
                    {time.hour}hrs {time.min}mins {time.sec}secs
                </div>
            </div>
            <div className="space-x-[3px] flex">
                {
                    props.index > 0 &&
                    <span onClick={() => props.moveUpCb(props.index)} className="p-2 hover:bg-stone-400 dark:hover:bg-stone-700">
                        <ArrowUp className="w-[14px] h-[14px]" />
                    </span>
                }
                {
                    props.index < props.totalItems - 1 &&
                    <span onClick={() => props.moveDwCb(props.index)} className="p-2 hover:bg-stone-400 dark:hover:bg-stone-700">
                        <ArrowDown className="w-[14px] h-[14px]" />
                    </span>
                }
                <span onClick={() => props.editCb(props.index)} className="p-2 hover:bg-stone-400 dark:hover:bg-stone-700">
                    <Pen className="w-[14px] h-[14px]" />
                </span>
                <span onClick={() => props.rmCb(props.index)} className="p-2 hover:bg-stone-400 dark:hover:bg-stone-700">
                    <X className="w-[14px] h-[14px]" />
                </span>
            </div>
        </div>
    )
})