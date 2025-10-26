"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store_ from "./redux_store";


interface ReduxProviderProps {
  children: ReactNode;
}



const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {


  return (
    <Provider store={store_}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
