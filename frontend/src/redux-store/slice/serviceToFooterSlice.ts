"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workflow__ } from "@/app/admin/service/list/page"; // <- apna service type import karo

interface ServiceState {
  services: Workflow__[];
}

const initialState: ServiceState = {
  services: [],
};

const ServiceToFooter = createSlice({
  name: "servicetofooter",
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Workflow__[]>) => {
      state.services = action.payload;
    },
    clearServices: (state) => {
      state.services = [];
    },
  },
});

export const { setServices, clearServices } = ServiceToFooter.actions;
export default ServiceToFooter.reducer;
