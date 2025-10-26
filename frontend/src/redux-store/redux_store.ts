"use client";

import userSlice from './slice/userSlice'
import ServiceToFooter from './slice/serviceToFooterSlice'
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";


const store_ = configureStore({
  reducer: {
    user: userSlice,
    servicetofooter: ServiceToFooter,
  },
});



export type RootState = ReturnType<typeof store_.getState>
export type AppDispatch = typeof store_.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>() 
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector 


export default store_
