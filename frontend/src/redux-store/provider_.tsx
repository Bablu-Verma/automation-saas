"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import store_ from "./redux_store";
import { usePathname } from "next/navigation";


interface ReduxProviderProps {
  children: ReactNode;
}



const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const pathname = usePathname();




  return (
    <Provider store={store_}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
