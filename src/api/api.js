import axios from 'axios'

export const myAxious = axios.create({
    baseURL:'http://13.215.161.193',
    headers:{
        // "Content-Type":"application/json"
        "Content-Type":""
    }
})