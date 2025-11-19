import React, { ReactNode } from 'react'
import DashboardProvider from './dashboard_provider';
import DashboardMenu from '@/components/header/DashboardMenu';



interface LayoutProps {
    children: ReactNode;
  }
  
const DashboardLayout:React.FC<LayoutProps> = ({ children }) => {

  return (
    <DashboardProvider>
       <div className="flex max-w-7xl pt-20 pb-10 gap-5  mx-auto px-4 sm:px-6 lg:px-8">
           <DashboardMenu />
            <main className="flex-1 min-h-screen">
              {children}
            </main>
          </div>
    </DashboardProvider>
  )
}

export default DashboardLayout