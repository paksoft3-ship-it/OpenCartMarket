"use client";

import { useMemo, useState } from "react";
import { useCan } from "@/components/admin/AdminAccessContext";

type TicketStatus = "open" | "pending" | "resolved" | "escalated";
type Priority = "low" | "normal" | "high";

const tickets = [
  { id: "#1042", subject: "MegaMenu not saving settings", user: "ahmet@store.com", status: "open" as TicketStatus, priority: "high" as Priority, slaHours: 3, csat: null, queue: "technical" },
  { id: "#1039", subject: "License key invalid on staging", user: "dev@agency.com", status: "pending" as TicketStatus, priority: "normal" as Priority, slaHours: 6, csat: null, queue: "license" },
  { id: "#1037", subject: "Invoice PDF not downloadable", user: "support@shop.com", status: "resolved" as TicketStatus, priority: "low" as Priority, slaHours: 0, csat: 5, queue: "billing" },
  { id: "#1033", subject: "Module broke checkout flow", user: "ops@shopline.com", status: "escalated" as TicketStatus, priority: "high" as Priority, slaHours: 1, csat: null, queue: "technical" },
];

export default function AdminSupportPage() {
  const canReply = useCan("send_support_reply");
  const [selectedId, setSelectedId] = useState(tickets[0].id);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const selected = tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0];

  const filtered = useMemo(() => {
    return tickets.filter((ticket) => (statusFilter === "all" ? true : ticket.status === statusFilter));
  }, [statusFilter]);

  const kpis = useMemo(() => {
    const open = tickets.filter((ticket) => ticket.status === "open" || ticket.status === "pending").length;
    const escalated = tickets.filter((ticket) => ticket.status === "escalated").length;
    const avgSla = tickets.filter((ticket) => ticket.slaHours > 0).reduce((sum, ticket) => sum + ticket.slaHours, 0) / 3;
    const csat = tickets.filter((ticket) => ticket.csat).reduce((sum, ticket) => sum + (ticket.csat ?? 0), 0) / 1;
    return { open, escalated, avgSla, csat };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">SLA Control Tower</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ticket queue, escalation ve kalite metrikleri tek panelde.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label="Open Tickets" value={kpis.open.toString()} />
        <Kpi label="Escalated" value={kpis.escalated.toString()} />
        <Kpi label="Avg SLA" value={`${kpis.avgSla.toFixed(1)}h`} />
        <Kpi label="CSAT" value={`${kpis.csat.toFixed(1)}/5`} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <StatusPill active={statusFilter === "all"} label="All" onClick={() => setStatusFilter("all")} />
        <StatusPill active={statusFilter === "open"} label="Open" onClick={() => setStatusFilter("open")} />
        <StatusPill active={statusFilter === "pending"} label="Pending" onClick={() => setStatusFilter("pending")} />
        <StatusPill active={statusFilter === "resolved"} label="Resolved" onClick={() => setStatusFilter("resolved")} />
        <StatusPill active={statusFilter === "escalated"} label="Escalated" onClick={() => setStatusFilter("escalated")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Queue</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(ticket.id)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.subject}</p>
                    <p className="text-xs text-slate-500">{ticket.user}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">{ticket.queue}</td>
                  <td className="px-4 py-3"><Tag value={ticket.status} type="status" /></td>
                  <td className="px-4 py-3"><Tag value={ticket.priority} type="priority" /></td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{ticket.slaHours ? `${ticket.slaHours}h` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.id}: {selected.subject}</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">Musteri: Sorun halen devam ediyor, adim adim kontrol listesi istiyor.</div>
              <div className="rounded-lg bg-primary/10 p-3 text-primary">Support macro: cache temizleme + mod refresh + conflict module audit.</div>
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
              <textarea className="w-full resize-none border-none p-0 text-sm outline-none focus:ring-0 dark:bg-transparent" placeholder="Yanıt yaz..." rows={4} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">Save Draft</button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canReply}>Send Reply</button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Escalation Playbook</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">High + technical + SLA &lt; 2h then escalate to Tier 2.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">License failures: attach activation logs.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Invoice issues: verify payment provider webhook.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function StatusPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${active ? "bg-primary text-white" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function Tag({ value, type }: { value: string; type: "status" | "priority" }) {
  const tone =
    value === "escalated" || value === "high"
      ? "bg-red-100 text-red-700"
      : value === "pending" || value === "normal"
      ? "bg-amber-100 text-amber-700"
      : value === "resolved" || value === "low"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{type === "status" ? value : `${value} priority`}</span>;
}
