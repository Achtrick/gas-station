import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import auth from "./reducers/auth";

// creating store
export const store = configureStore({ reducer: { auth } });

// assigning store to next wrapper
const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
