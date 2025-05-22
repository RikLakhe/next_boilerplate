import { combineReducers, configureStore } from "@reduxjs/toolkit";
import masterDataReducer from "./features/masterData/masterData.slice";
import userDataReducer from "./features/directory/user.slice";
import eventsReducer from "./features/events/events.slice";
import departmentReducer from "./features/department/department.slice";
import fiscalYearReducer from "./features/fiscalYear/fiscal.slice";
// import other reducers...

const rootReducer = combineReducers({
  masterData: masterDataReducer,
  userData: userDataReducer,
  events: eventsReducer,
  department: departmentReducer,
  fiscalYear: fiscalYearReducer,
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
