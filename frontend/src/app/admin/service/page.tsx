"use client"

import { FiPlusCircle, FiList } from "react-icons/fi"
import Link from "next/link"

export default function adminservicepage() {
  const supportOptions = [
    {
      icon: <FiPlusCircle size={28} />,
      title: "Add",
      desc: "Add new Work Flow",
      href: "/admin/service/add",
    },
    {
      icon: <FiList size={28} />,
      title: "List",
      desc: "All Work flow",
      href: "/admin/service/list",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6  ">
      <h1
        className="text-xl md:text-3xl font-extrabold text-center mb-12"
      >
        Service
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {supportOptions.map((item, i) => (
          <div
            key={i}
            className=" rounded-2xl p-8 shadow-md border border-secondary  transition"
          >
            <Link href={item.href} className="flex flex-col gap-4 h-full">
              <div className="flex items-center gap-4">
                <span className="text-secondary">{item.icon}</span>
                <h3 className="text-2xl font-bold">{item.title}</h3>
              </div>
              <p className="text-gray-700">{item.desc}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
