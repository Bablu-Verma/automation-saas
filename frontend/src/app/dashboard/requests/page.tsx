const requests = [
  { id: "req_1", service: "CRM Sync", status: "Completed" },
  { id: "req_2", service: "Slack Alerts", status: "Running" },
  { id: "req_3", service: "Invoice Generator", status: "Failed" },
]

export default function RequestsPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Requests</h1>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Service</th>
            <th className="p-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id} className="border-t">
              <td className="p-2">{req.id}</td>
              <td className="p-2">{req.service}</td>
              <td className={`p-2 ${req.status === "Completed" ? "text-green-600" : req.status === "Failed" ? "text-red-600" : "text-yellow-600"}`}>
                {req.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
