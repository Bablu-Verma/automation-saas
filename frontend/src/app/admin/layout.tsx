
import AdminSidebar from "./_components/AdminSidebar"
import { InternalProvider } from "./internal_provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternalProvider>
     <div className="flex max-w-7xl m-auto pt-20 pb-10">
      <AdminSidebar />
      <main className="flex-1 p-6  min-h-screen">
        {children}
      </main>
      </div>
    </InternalProvider>
   
  )
}
