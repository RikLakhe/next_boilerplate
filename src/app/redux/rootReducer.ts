/* Instruments */
import { flightSlice, userAuthSlice } from "./duck";

export const reducer = {
  userAuth: userAuthSlice.reducer,
  flight: flightSlice.reducer,
};
