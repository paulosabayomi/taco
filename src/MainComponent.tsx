import { ArrowDown, ArrowUp, BrushCleaning, Pen, Plus, X } from "lucide-react";
import React from "react";
import { useMainState } from "./shared/zus-store";
import { TaskList } from "./shared/SharedComponents";
import { friendlyTime } from "./shared/functions";

export default React.memo((props: any) => {
    const [hour, setHour] = React.useState<number>(0)
    const [min, setMin] = React.useState<number>(0)
    const [sec, setSec] = React.useState<number>(0)
    const [title, setTitle] = React.useState<string>('')
    const [error, setError] = React.useState<string>('')
    const tasks = useMainState(state => state.tasks)
    const taskMemo = React.useMemo(() => tasks, [tasks])
    const [currentTaskEdit, setCurrentTaskEdit] = React.useState<number>(-1)

    const set_state = useMainState(state => state.set_state)

    const handleAddTask = React.useCallback(() => {
        setError('')
        const h = hour * (60 * 60 * 1000);
        const m = min * (60 * 1000);
        const s = sec * 1000;
        const duration = h + m + s
        const task = {
            title,
            duration
        }
        if(tasks.find(task => task.title.toLowerCase() === title.toLowerCase() && task.duration == duration) != undefined) return setError('You already set the task')

        console.log("task", task);
        
        set_state('tasks', [...tasks, task])
        setHour(0)
        setMin(0)
        setSec(0)
        setTitle('')
    }, [title, hour, min, sec, tasks])

    const handleEditTask = React.useCallback((index: number) => {
        setCurrentTaskEdit(index)
        const task = tasks[index]
        const time = friendlyTime(task.duration)
        setHour(time.hour)
        setMin(time.min)
        setSec(time.sec)
        setTitle(task.title)
    }, [tasks])

    const handleUpdateTask = React.useCallback((props: any) => {
        const h = hour * (60 * 60 * 1000);
        const m = min * (60 * 1000);
        const s = sec * 1000;
        const duration = h + m + s
        const task = {
            title,
            duration
        }

        const clone_tasks = [...tasks]
        clone_tasks[currentTaskEdit] = task

        set_state('tasks', clone_tasks)
        setHour(0)
        setMin(0)
        setSec(0)
        setTitle('');
        setCurrentTaskEdit(-1)
    }, [title, hour, min, sec, tasks, currentTaskEdit])

    const handleMoveTaskUp = React.useCallback((index: number) => {
        const new_index = index - 1;
        const item = tasks[index]
        const clone_tasks = [...tasks]
        clone_tasks.splice(index, 1)
        clone_tasks.splice(new_index, 0, item)
        set_state('tasks', clone_tasks)
    }, [tasks])

    const handleMoveTaskDown = React.useCallback((index: number) => {
        const new_index = index + 1;
        const item = tasks[index]
        const clone_tasks = [...tasks]
        clone_tasks.splice(index, 1)
        clone_tasks.splice(new_index, 0, item)
        set_state('tasks', clone_tasks)
    }, [tasks])

    const handleRmTask = React.useCallback((index: number) => {
        console.log("I was clicked111", tasks)
        const clone_task = [...tasks]
        clone_task.splice(index, 1)
        set_state('tasks', clone_task)
        console.log("I was clicked", tasks, clone_task)
    }, [tasks])

    const handleInputChange = React.useCallback((title: 'hour' | 'min' | 'sec', value: string) => {
        setError('')
        const regexp = /\d+/
        if (!regexp.test(value) && value !== '') {
            return setError('Only numbers can be provided')
        }

        if (title == 'hour') setHour(value == '' ? 0 : parseInt(value))
        if (title == 'min' && (parseInt(value) < 60 || value == '')) setMin(value === '' ? 0 : parseInt(value))
        if (title == 'sec' && (parseInt(value) < 60 || value == '')) setSec(value === '' ? 0 : parseInt(value))
    }, [])

    return (
        <div className="h-[100vh] overflow-hidden grid grid-cols-[250px_1fr] grid-rows-[30px_1fr]">
            <div className="header relative flex items-center justify-center col-span-full border-b-[.5px] border-stone-400 dark:border-stone-700">
                <div onClick={() => window.electron.close_app()} className="absolute left-0 h-[100%] w-[30px] flex justify-center items-center">
                    <X className="w-[20px] h-[20px]" />
                </div>
                <div className='text-stone-800 flex items-center justify-center dark:text-stone-200'>
                    Taco
                </div>
            </div>
            <div className="border-r-[.5px] h-[100%] overflow-hidden justify-between border-stone-400 dark:border-stone-700">
                <div className="flex overflow-auto relative h-[calc(100%-40px)] overflow-x-hidden flex-col space-y-4 text-xs p-2 divide-y-[.5px] divide-stone-800">
                    {
                        taskMemo.length == 0 ?
                        <div className="w-[100%] absolute top-[calc(50%-10px)] flex justify-center items-center">
                            <span className="font-italic text-stone-400 dark:text-stone-700">No tasks added yet</span>
                        </div>:
                        taskMemo.map((task, index) => 
                            <TaskList 
                                key={Math.floor(Math.random() * 9999999).toString()} 
                                data={task} 
                                index={index} 
                                rmCb={handleRmTask}  
                                editCb={handleEditTask}
                                moveUpCb={handleMoveTaskUp}
                                moveDwCb={handleMoveTaskDown}
                                totalItems={taskMemo.length}
                            />                  
                        )
                    }
                </div>
                <div className="h-[40px] flex flex-row">
                    <button disabled={taskMemo.length == 0} onClick={() => window.electron.open_child_win(tasks)} className="btn btn-soft flex-1">Start</button>
                    <button title="clear all" disabled={taskMemo.length == 0} onClick={() => {confirm("Are you sure you want to clear all tasks?") && set_state('tasks', [])}} className="btn btn-soft btn-secondary">
                        <BrushCleaning className="w-[20px] h-[20px]" />
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div className="flex flex-col">
                    <div className="text-xl font-bold mb-2 text-center">Add Task</div>
                    <div className="flex flex-col">
                        {/* <div className="text-sm opacity-70">Title</div> */}
                        <div>
                            <input type="text" value={title} onChange={(e) => setTitle((e.currentTarget as HTMLInputElement).value)} placeholder="Task title" className="input text-center h-[30px] border-[0px] focus:border-[0px] bg-transparent border-b-[1px] rounded-[0px] focus:outline-[0px]" />
                        </div>
                    </div>
                    <div className="flex flex-col mt-4">
                        <div className="text-sm opacity-70 mb-2">Duration</div>
                        <div className="flex space-x-4">
                            <input type="text" value={hour == 0 ? '' : hour} onChange={(e) => handleInputChange('hour', (e.currentTarget as HTMLInputElement).value)} placeholder="HH" className="input text-center w-[50px] bg-transparent rounded-[0px] focus:outline-[0px]" />
                            <input type="text" value={min == 0 ? '' : min} onChange={(e) => handleInputChange('min', (e.currentTarget as HTMLInputElement).value)} placeholder="MM" className="input text-center w-[50px] bg-transparent rounded-[0px] focus:outline-[0px]" />
                            <input type="text" value={sec == 0 ? '' : sec} onChange={(e) => handleInputChange('sec', (e.currentTarget as HTMLInputElement).value)} placeholder="SS" className="input text-center w-[50px] bg-transparent rounded-[0px] focus:outline-[0px]" />
                        </div>
                        <div className="text-xs mt-2 text-red-300 dark:text-red-600 opacity-70 mb-2">{error}</div>
                    </div>
                    <div>
                        <button onClick={currentTaskEdit > -1 ? handleUpdateTask : handleAddTask} disabled={error !== '' || (hour == 0 && min == 0 && sec == 0) || title == ''} className="btn btn-soft btn-primary w-[100%]">
                            <Plus className="w-[20px] h-[20px]" /> {currentTaskEdit > -1 ? "Update" : "Add"} Task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
})