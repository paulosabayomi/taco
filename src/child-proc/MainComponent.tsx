import { Pause, Play, X } from 'lucide-react'
import React from 'react'
import { TTask } from '../shared/types'
import { friendlyTime } from '../shared/functions'
// @ts-ignore
import sound from "../assets/sound.wav"
// @ts-ignore
import sound2 from "../assets/sound-2.mp3"

export default React.memo((props: any) => {
    const [tasks, setTasks] = React.useState<TTask[]>([])
    const [currentDuration, setCurrentDuration] = React.useState<number>(0)
    const [currentTime, setCurrentTime] = React.useState<{
        hour: number;
        min: number;
        sec: number;
    } | null>(null)
    const [currentMin, setCurrentMin] = React.useState<number>(0)
    const [currentHour, setCurrentHour] = React.useState<number>(0)
    const [currentSec, setCurrentSec] = React.useState<number>(0)
    const [currentTask, setCurrentTask] = React.useState<TTask>()
    const watch_intv_ref = React.useRef<any>(null)
    const current_durtn_ref = React.useRef<number>(0)
    const move_down_ref = React.useRef<number>(0)
    const current_task_ref = React.useRef<TTask>(undefined)
    const tasks_ref = React.useRef<TTask[]>([]);

    const [paused,setPaused] = React.useState<boolean>(false);

    const handlePauseTask = React.useCallback((state: any) => {
        setPaused(state)
        if (state) {
            clearTimeout(watch_intv_ref.current)
        }else{
            handle_watch_task(current_task_ref.current, true)
        }
    }, [])

    const handle_set_cur_task = React.useCallback(() => {
        
        const currentTaskIndex = current_task_ref.current == undefined ? 0 : tasks_ref.current.findIndex(task => task.duration == current_task_ref.current.duration && task.title == current_task_ref.current.title) + 1
        if (currentTaskIndex >= tasks_ref.current.length) {
            const audio = new Audio(sound2)
            audio.play()
            return 
        }
        const task = tasks_ref.current[currentTaskIndex]
        console.log("currentTaskIndex", currentTaskIndex, task, tasks_ref.current);
        setCurrentTask(task);
        current_task_ref.current = task
        handle_watch_task(task)
        setTimeout(() => {
            currentTaskIndex > 0 && animate_steps(task)            
        }, 0);
    }, [])

    const handle_watch_task = React.useCallback((currentTask: TTask, skip_init = false) => {
        console.log("currentTask0000", currentTask);
        
        if (!skip_init) {
            setCurrentDuration(currentTask.duration)
            setCurrentTime(friendlyTime(currentTask.duration) as any)
            current_durtn_ref.current = currentTask.duration;            
        }
        watch_intv_ref.current = setInterval(() => {

            if (current_durtn_ref.current == 0) {
                clearInterval(watch_intv_ref.current)
                const audio = new Audio(sound)
                audio.play()
                handle_set_cur_task()
            }
            
            const time = friendlyTime(current_durtn_ref.current, true)
            console.log("I am running", time, current_durtn_ref.current);
            setCurrentHour(time.hour)
            setCurrentMin(time.min)
            setCurrentSec(time.sec)
            current_durtn_ref.current = current_durtn_ref.current - 1000;
            
        }, 1000);
    }, [current_durtn_ref.current])

    const animate_steps = React.useCallback((currentTask: TTask) => {
        
        const current_task_index = tasks_ref.current.findIndex((t) => currentTask.title == t.title && currentTask.duration == t.duration)
        const win_rect = document.documentElement.clientHeight
        const steps_vertical = document.querySelector(".steps-vertical") as HTMLElement
        const current_task_rect = document.querySelector(`#id-${current_task_index}`).getBoundingClientRect()
        
        const move_up = (((current_task_rect.top + steps_vertical.offsetTop) - win_rect/2) + current_task_rect.height) - move_down_ref.current
        console.log("currentTaskin anime", move_up, current_task_index, current_task_rect, win_rect);
        move_down_ref.current = 0
        steps_vertical.animate([
            {
                transform: `translateY(${-move_up}px)`,
                easing: 'ease-in'
            }
        ], {
            duration: 1000,
        })
        setTimeout(() => {
            steps_vertical.style.transform = `translateY(${-move_up}px)`
        }, 1000);
    }, [tasks_ref.current])

    React.useLayoutEffect(() => {
        const win_rect = document.documentElement.clientHeight
        console.log("win_rect", win_rect);
        
        const steps_vertical = document.querySelector(".steps-vertical") as HTMLElement;
        steps_vertical.style.transform = `translateY(${(win_rect/2)-15}px)`
        move_down_ref.current = (win_rect/2)-15;
        
        window.addEventListener('data-tasks', (evt: Event & {detail: TTask[]}) => {
            console.log("data task event in main", evt, evt.detail);
            setTasks(evt.detail)
            tasks_ref.current = evt.detail
            setTimeout(() => {
                handle_set_cur_task()                
            }, 0);
        })
    }, [])

    return (
        <div className="h-[100vh] overflow-hidden grid grid-cols-[200px_1fr] grid-rows-[30px_1fr]">
            <div className="header flex justify-center relative col-span-full border-b-[.5px] border-stone-400 dark:border-stone-700">
                <div onClick={() => window.close()} className="absolute left-0 h-[100%] w-[30px] flex justify-center items-center">
                    <X className="w-[20px] h-[20px]" />
                </div>
                <div className='text-stone-800 flex items-center justify-center dark:text-stone-200'>
                    Taco Task
                </div>
            </div>

            <div className='border-r-[.5px] overflow-hidden border-stone-400 dark:border-stone-700'>
                <ul className="steps steps-vertical text-xs">
                    {
                        currentTask != undefined &&
                        tasks.map((task, index) => 
                            <li key={index} id={'id-'+index.toString()} className={`step ${tasks.findIndex((t) => currentTask.title == t.title && currentTask.duration == t.duration) >= index && 'step-primary'}`}>
                                <span className='flex flex-col'>
                                    <span>{task.title}</span>
                                    <span className='opacity-70'>{`${friendlyTime(task.duration).hour}hrs ${friendlyTime(task.duration).min}min ${friendlyTime(task.duration).sec}sec`}</span>
                                </span>

                            </li>
                        )
                    }
                    {/* <li className="step step-primary">Choose plan</li>
                    <li className="step">Purchase</li>
                    <li className="step">Receive Product</li> */}
                </ul>
            </div>
            <div className='flex justify-center overflow-hidden items-center'>
                <div className="flex flex-col">
                    {
                        currentTask != undefined &&
                        <div className='text-center capitalize text-xl mb-2 text-violet-600 dark:text-violet-400 font-bold'>
                            {
                                currentTask.title
                            }
                        </div>
                    }
                    
                    <div className='text-xs text-center text-purple-600 mb-4 dark:text-purple-400'>
                        {
                            currentTime == null ?
                            <div></div>:
                            currentTime?.hour.toString().padStart(2, '0') + ':' + currentTime?.min.toString().padStart(2, '0') + ':' + currentTime?.sec.toString().padStart(2, '0')
                        }
                    </div>
                    
                    {
                        currentTime != undefined &&
                        <div className='flex space-x-2 justify-center items-center'>
                            <span className="countdown font-mono text-4xl">
                                {/* @ts-ignore */}
                                <span style={{"--value":currentHour}} aria-live="polite" aria-label={currentHour}>{currentHour}</span>
                            </span>
                            <span>:</span>
                            <span className="countdown font-mono text-4xl">
                                {/* @ts-ignore */}
                                <span style={{"--value":currentMin}} aria-live="polite" aria-label={currentMin}>{currentMin}</span>
                            </span>
                            <span>:</span>
                            <span className="countdown font-mono text-4xl">
                                {/* @ts-ignore */}
                                <span style={{"--value":currentSec}} aria-live="polite" aria-label={currentSec}>{currentSec}</span>
                            </span>
                        </div>
                    }

                    <div className='mt-4 flex justify-center'>
                        {
                            paused ? 
                            <Play onClick={() => handlePauseTask(false)} className='w-[20px] h-[20px]' />:
                            <Pause onClick={() => handlePauseTask(true)} className='w-[20px] h-[20px]' />
                        }
                    </div>
                </div>
            </div>

        </div>
    )
})