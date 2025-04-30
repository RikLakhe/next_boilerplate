/* Core */
import {
  configureStore,
  type ConfigureStoreOptions,
  type ThunkAction,
  type Action,
} from "@reduxjs/toolkit";
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from "react-redux";

/* Instruments */
import { reducer } from "./rootReducer";

const configreStoreDefaultOptions: ConfigureStoreOptions = { reducer };

export const makeReduxStore = (
  options: ConfigureStoreOptions = configreStoreDefaultOptions,
) => {
  const store = configureStore(options);

  return store;
};

export const reduxStore = configureStore({
  reducer,
});
export const useDispatch = () => {
  return useReduxDispatch<ReduxDispatch>();
};
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector;

/* Types */
export type ReduxStore = typeof reduxStore;
export type ReduxState = ReturnType<typeof reduxStore.getState>;
export type ReduxDispatch = typeof reduxStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ReduxState,
  unknown,
  Action
>;
export type RootState = ReturnType<typeof reduxStore.getState>;
