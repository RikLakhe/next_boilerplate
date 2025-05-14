// /store/users/users.slice.ts
import apiClient from '@/app/libs/apiClient'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from './users.types'

interface UsersState {
  list: User[]
  loading: boolean
  error?: string
}
const initialState: UsersState = { list: [], loading: false }

export const loadUsers = createAsyncThunk('users/loadAll', async () => {
  const resp = await apiClient.get<User[]>('/users')
  return resp.data
})

// A plain “setUsers” for SSR hydration:
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadUsers.pending, state => { state.loading = true })
      .addCase(loadUsers.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload
      })
      .addCase(loadUsers.rejected, (state, { error }) => {
        state.loading = false
        state.error = error.message
      })
  }
})

export const { setUsers } = usersSlice.actions
export default usersSlice.reducer
