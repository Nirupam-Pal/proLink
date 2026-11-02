const { default: axios } = require("axios");


export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://profilelink.onrender.com/"
// export const BASE_URL = "http://localhost:9080"

export const clientServer = axios.create({
    baseURL: BASE_URL,
})