
export const getMinutesBetweenDates = (older: Date, newer: Date): number => {
    const ms = newer.getTime() - older.getTime()
    const seconds =  Math.floor(ms / 1000)
    return Math.floor(seconds / 60)
}