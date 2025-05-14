import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import usersReducer from './users/users.slice'

export const makeStore = () =>
  configureStore({
    reducer: { users: usersReducer },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof makeStore>['getState']
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']

export const AppStore = makeStore();

export const wrapper = createWrapper<AppStore>(makeStore)
