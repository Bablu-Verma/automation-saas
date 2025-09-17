import Sidebar from "@/components/Sidebar"
import AdminSidebar from "./_components/AdminSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-7xl m-auto pt-20 pb-10">
      <AdminSidebar />
      <main className="flex-1 p-6  min-h-screen">
        {children}
      </main>
    </div>
  )
}
