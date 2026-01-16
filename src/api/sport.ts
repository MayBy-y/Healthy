import axios from 'axios'
interface sportItem {
    date: string
    type: string
    duration: number
    calories?: number
    note?: string
}
const todayDate = new Date().toISOString().split('T')[0]
console.log(todayDate);

const token = localStorage.getItem("token") || "";
console.log(token);

export function addSport(data: sportItem) {
    return axios.post('http://localhost:3000/api/sport', data,
        { headers: { Authorization: `${token}` }, })
}

export function getSportList() {
    return axios.get('http://localhost:3000/api/sport/list',
        { headers: { Authorization: `${token}` }, }
    )
}
export function getToday() {
    return axios.get(`http://localhost:3000/api/sport/today?date=${todayDate}`,
        { headers: { Authorization: `${token}` }, }
    )
}
export function getStep() {
    return axios.get(`http://localhost:3000/api/steps/today?date=${todayDate}`,
        { headers: { Authorization: `${token}` }, }
    )
}
export function todayAnalyze() {
    return axios.post(`http://localhost:3000/api/sport/todayAnalyze?date=${todayDate}`,
        {},
        { headers: { Authorization: `${token}` }, }
    )
}