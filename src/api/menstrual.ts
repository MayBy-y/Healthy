import axios from 'axios'
interface menstrualItem {
    startDate: Date,
    stayTime: number,
    leaveTime: number,
}
const token = localStorage.getItem("token")

export function addMenstrual(data: menstrualItem) {
    return axios.post('http://localhost:3000/api/menstrual/add', { data },
        { headers: { Authorization: `${token}` }, }
    )
}
export function getMen() {
    return axios.get('http://localhost:3000/api/menstrual/last',
        { headers: { Authorization: `${token}` }, }
    )
}