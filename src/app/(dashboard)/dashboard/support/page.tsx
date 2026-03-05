import Link from "next/link";
import { supportTickets } from "@/lib/data/supportTickets";

function badge(status: string) {
  if (status === "open") return "bg-amber-100 text-amber-700";
  if (status === "answered") return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function DashboardSupportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Destek Taleplerim</h1>
        <Link href="/dashboard/support/new" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white">Yeni Talep</Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Ticket</th>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Durum</th>
              <th className="px-5 py-3">Güncelleme</th>
            </tr>
          </thead>
          <tbody>
            {supportTickets.map((ticket) => (
              <tr key={ticket.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm">
                  <Link href={`/dashboard/support/${ticket.id}`} className="font-semibold text-slate-900 hover:text-primary dark:text-slate-100">{ticket.subject}</Link>
                  <p className="text-xs text-slate-500">{ticket.id}</p>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{ticket.product}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${badge(ticket.status)}`}>{ticket.status}</span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-500">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
