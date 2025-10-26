
import AdminSidebar from "./_components/AdminSidebar"
import { InternalProvider } from "./internal_provider"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <InternalProvider>
     <div className="flex max-w-7xl pt-20 pb-10 gap-5  mx-auto px-4 sm:px-6 lg:px-8">
      <AdminSidebar />
      <main className="flex-1 pt-5 min-h-screen text-secondary bg-white">
        {children}
      </main>
      </div>
    </InternalProvider>
   
  )
}
