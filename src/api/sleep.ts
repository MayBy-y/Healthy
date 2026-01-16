import axios from 'axios'
interface sleepItem {
    date: string
    targetHour: number,
    targetMin: number
    actualHour: number
    actualMin: number
}
const today = new Date().toISOString().split('T')[0]
const token = localStorage.getItem("token") || "";

export function getSleeplist() {
    return axios.get('http://localhost:3000/api/sleep/list',
        { headers: { Authorization: `${token}` }, }
    )
}
export function getToday() {
    return axios.get(`http://localhost:3000/api/deepsleep/today?date=${today}`,
        { headers: { Authorization: `${token}` }, })
}
export function TodaySleep() {
    return axios.get(`http://localhost:3000/api/sleep/today?date=${today}`,
        {
            headers: {
                Authorization: token
            }
        })
}
export function TodayAnalze() {
    return axios.post(`http://localhost:3000/api/deepsleep/oneWord?date=${today}`,
        {},
        { headers: { Authorization: `${token}` }, })
}