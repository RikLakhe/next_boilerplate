/* Core */
/* eslint-disable */
// @ts-nocheck

import { createAsyncThunk } from "@reduxjs/toolkit";

/* Instruments */
import type { ReduxDispatch, ReduxState } from "./store";

type AppAsyncThunkConfig = {
  state: ReduxState;
  dispatch: ReduxDispatch;
  rejectValue: string;
};

/**
 * ? A utility function to create a typed Async Thnuk Actions.
 */
export const createAppAsyncThunk = createAsyncThunk;
