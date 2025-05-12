export const friendlyTime = (duration: number, clock =false) => {
    const hour = clock ? Math.floor(duration / (3600 * 1000)) : Math.floor(duration / (60 * 60 * 1000))
    const min = clock ? Math.floor((duration % (3600 * 1000)) / (60 * 1000)) : Math.floor((duration - (hour * (60 * 60 * 1000))) / (60*1000))
    const sec = clock ? (duration % (60 * 1000)) / 1000 : Math.floor(((duration - (hour * (60 * 60 * 1000))) - (min * 60 * 1000)) / 1000)

    return {
        hour,min,sec
    }
}

export const broadcast_event = (event_name: string, data: any) => {
    const ev = new CustomEvent(event_name, {
        detail: data
    })
    window.dispatchEvent(ev)
}