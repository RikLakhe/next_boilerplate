import { combineReducers, configureStore } from "@reduxjs/toolkit";
import masterDataReducer from "./features/masterData/masterData.slice";
// import other reducers...

const rootReducer = combineReducers({
  masterData: masterDataReducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Middleware can be added here (e.g., for RTK Query)
  });
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStoreType = ReturnType<typeof makeStore>;
export type AppDispatch = AppStoreType["dispatch"];
export type RootState = ReturnType<typeof rootReducer>;

export const AppStore = makeStore();
