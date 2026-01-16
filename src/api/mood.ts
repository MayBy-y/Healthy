import axios from 'axios'
const today = new Date().toISOString().split('T')[0]
const token = localStorage.getItem("token") || "";
export function TodayMood() {
    return axios.post(`http://localhost:3000/api/mood/todayAnalyze?date=${today}`,
        {},
        { headers: { Authorization: `${token}` }, })
}
export function Moods() {
    return axios.get(`http://localhost:3000/api/mood/today?date=${today}`,
        { headers: { Authorization: `${token}` }, })
}