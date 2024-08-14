// src/api/api.js

import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.VUE_API_BASE_API,
    headers: {
        'Content-Type': 'application/json'
    }
})

export const get = (url, params) => {
    return apiClient.get(url, { params })
}

export const post = (url, data) => {
    return apiClient.post(url, data);
}

export const put = (url, data) => {
    return apiClient.put(url, data);
}

export const del = (url, params) => {
    return apiClient.delete(url, { params });
}