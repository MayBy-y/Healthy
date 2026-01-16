import axios from 'axios'
const today = new Date().toISOString().split('T')[0]
const token = localStorage.getItem("token") || "";
export function TodayWeight() {
    return axios.post(`http://localhost:3000/api/weight/todayAnaylze?date=${today}`,
        {},
        { headers: { Authorization: `${token}` }, })
}