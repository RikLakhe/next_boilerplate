// /services/userService.ts

import apiClient from "@/app/libs/apiClient"
import { User } from "./users.types"


export const fetchUsers = () => apiClient.get<User[]>('/users')
export const fetchUser  = (id: string) => apiClient.get<User>(`/users/${id}`)
export const createUser = (data: Partial<User>) => apiClient.post<User>('/users', data)
export const updateUser = (id: string, data: Partial<User>) => apiClient.put<User>(`/users/${id}`, data)
export const deleteUser = (id: string) => apiClient.delete<void>(`/users/${id}`)
