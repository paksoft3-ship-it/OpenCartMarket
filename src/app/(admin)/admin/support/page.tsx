"use client";

import { useEffect, useMemo, useState } from "react";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";
import { toast } from "sonner";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type Priority = "low" | "medium" | "high" | "critical";

interface SupportTicket {
  id: string;
  subject: string;
  customer: string;
  customerEmail: string;
  status: TicketStatus;
  priority: Priority;
  category: string;
  message: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSupportPage() {
  const tr = useAdminLanguage() === "tr";
  const canReply = useCan("send_support_reply");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");

  useEffect(() => {
    fetch("/api/admin/support")
      .then((r) => r.json())
      .then((data) => {
        const items: SupportTicket[] = data.items ?? [];
        setTickets(items);
        if (items.length > 0) setSelectedId(items[0].id);
      })
      .catch(() => toast.error(tr ? "Biletler yüklenemedi." : "Failed to load tickets."))
      .finally(() => setLoading(false));
  }, [tr]);

  const selected = tickets.find((t) => t.id === selectedId) ?? tickets[0] ?? null;

  const filtered = useMemo(() => {
    return tickets.filter((t) => statusFilter === "all" || t.status === statusFilter);
  }, [tickets, statusFilter]);

  const kpis = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open" || t.status === "in_progress").length;
    const closed = tickets.filter((t) => t.status === "closed").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;
    return { open, closed, resolved, total: tickets.length };
  }, [tickets]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Destek Kontrol Merkezi" : "Support Control Tower"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Bilet kuyruğu ve kalite metrikleri tek panelde." : "Ticket queue and quality metrics in one panel."}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label={tr ? "Toplam Bilet" : "Total Tickets"} value={loading ? "—" : kpis.total.toString()} />
        <Kpi label={tr ? "Açık Bilet" : "Open Tickets"} value={loading ? "—" : kpis.open.toString()} />
        <Kpi label={tr ? "Çözüldü" : "Resolved"} value={loading ? "—" : kpis.resolved.toString()} />
        <Kpi label={tr ? "Kapalı" : "Closed"} value={loading ? "—" : kpis.closed.toString()} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <StatusPill active={statusFilter === "all"} label={tr ? "Tümü" : "All"} onClick={() => setStatusFilter("all")} />
        <StatusPill active={statusFilter === "open"} label={tr ? "Açık" : "Open"} onClick={() => setStatusFilter("open")} />
        <StatusPill active={statusFilter === "in_progress"} label={tr ? "Devam Ediyor" : "In Progress"} onClick={() => setStatusFilter("in_progress")} />
        <StatusPill active={statusFilter === "resolved"} label={tr ? "Çözüldü" : "Resolved"} onClick={() => setStatusFilter("resolved")} />
        <StatusPill active={statusFilter === "closed"} label={tr ? "Kapalı" : "Closed"} onClick={() => setStatusFilter("closed")} />
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          {tr ? "Yükleniyor..." : "Loading..."}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          {tr ? "Henüz destek bileti yok." : "No support tickets yet."}
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3">{tr ? "Bilet" : "Ticket"}</th>
                  <th className="px-4 py-3">{tr ? "Kategori" : "Category"}</th>
                  <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                  <th className="px-4 py-3">{tr ? "Öncelik" : "Priority"}</th>
                  <th className="px-4 py-3">{tr ? "Tarih" : "Date"}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                    onClick={() => setSelectedId(ticket.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.subject}</p>
                      <p className="text-xs text-slate-500">{ticket.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 capitalize">{ticket.category}</td>
                    <td className="px-4 py-3"><Tag value={ticket.status} type="status" tr={tr} /></td>
                    <td className="px-4 py-3"><Tag value={ticket.priority} type="priority" tr={tr} /></td>
                    <td className="px-4 py-3 text-sm text-slate-500">{new Date(ticket.createdAt).toLocaleDateString(tr ? "tr-TR" : "en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="space-y-4">
            {selected && (
              <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.subject}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.customerEmail} • {selected.category}</p>
                {selected.message && (
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">{selected.message}</div>
                  </div>
                )}
                <div className="mt-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                  <textarea
                    className="w-full resize-none border-none p-0 text-sm outline-none focus:ring-0 dark:bg-transparent"
                    placeholder={tr ? "Yanıt yaz..." : "Write a reply..."}
                    rows={4}
                  />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold dark:border-slate-700">{tr ? "Taslak Kaydet" : "Save Draft"}</button>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canReply}>{tr ? "Yanıt Gönder" : "Send Reply"}</button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tr ? "Eskalasyon Playbook'u" : "Escalation Playbook"}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Yüksek + teknik + SLA < 2s ise Tier 2'ye eskale et." : "High + technical + SLA < 2h then escalate to Tier 2."}</li>
                <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Lisans hataları: aktivasyon loglarını ekle." : "License failures: attach activation logs."}</li>
                <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Fatura sorunları: ödeme sağlayıcı webhook'unu doğrula." : "Invoice issues: verify payment provider webhook."}</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
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

function Tag({ value, type, tr }: { value: string; type: "status" | "priority"; tr: boolean }) {
  const tone =
    value === "critical" || value === "high"
      ? "bg-red-100 text-red-700"
      : value === "in_progress" || value === "medium"
      ? "bg-amber-100 text-amber-700"
      : value === "resolved" || value === "closed" || value === "low"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";

  const statusLabels: Record<string, string> = {
    open: tr ? "açık" : "open",
    in_progress: tr ? "devam ediyor" : "in progress",
    resolved: tr ? "çözüldü" : "resolved",
    closed: tr ? "kapalı" : "closed",
  };
  const priorityLabels: Record<string, string> = {
    low: tr ? "düşük" : "low priority",
    medium: tr ? "orta" : "medium priority",
    high: tr ? "yüksek" : "high priority",
    critical: tr ? "kritik" : "critical",
  };
  const label = type === "status" ? (statusLabels[value] ?? value) : (priorityLabels[value] ?? value);
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{label}</span>;
}
