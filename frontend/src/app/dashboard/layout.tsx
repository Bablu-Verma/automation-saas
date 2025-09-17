import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-7xl m-auto pt-20 pb-10">
      <Sidebar />
      <main className="flex-1 p-6  min-h-screen">
        {children}
      </main>
    </div>
  )
}
