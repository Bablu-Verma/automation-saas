import React, { ReactNode } from 'react'
import DashboardProvider from './dashboard_provider';
import Sidebar from '@/components/header/Sidebar';


interface LayoutProps {
    children: ReactNode;
  }
  
const DashboardLayout:React.FC<LayoutProps> = ({ children }) => {

  return (
    <DashboardProvider>
       <div className="flex max-w-7xl m-auto pt-20 pb-10">
            <Sidebar />
            <main className="flex-1 p-6  min-h-screen">
              {children}
            </main>
          </div>
    </DashboardProvider>
  )
}

export default DashboardLayout