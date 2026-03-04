import axios from "axios";
const token = localStorage.getItem("token") || ""
export function getOwn() {
    return axios.get('http://localhost:3000/api/post/list',
        { headers: { Authorization: `${token}` }, }
    )
}