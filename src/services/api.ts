import axios from 'axios'

export const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params:{
        api_key: "006b2e34948649813a969980105785b1",
        language:"pt-BR",
        include_adult: false,
    },
})