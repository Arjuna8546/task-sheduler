import axios from "../axiosinterceptor/UserAxiosInterceptor";

export const login = (formBody) =>axios.post('token/',formBody)

export const signup = (formBody) => axios.post('register/',formBody)

export const verifyotp = (formBody) => axios.post('verifyotp/',formBody)

export const resendotp = (formBody) => axios.post('resendotp/',formBody)

export const getTask = (userId) => axios.get(`tasks/${userId}`)

export const addTask = (formBody) => axios.post('tasks/',formBody)

export const editTask = (task_id,tasks) => axios.patch(`tasks/edit/${task_id}`,tasks)

export const deleteTask = (task_id) => axios.delete(`tasks/delete/${task_id}`)

export const logout = () => axios.post(`logout/`,{})

