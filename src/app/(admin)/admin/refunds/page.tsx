"use client";

import { useMemo, useState } from "react";
import { RefundRisk, RefundStatus } from "@/lib/data/adminOps";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

export default function AdminRefundsPage() {
  const tr = useAdminLanguage() === "tr";
  const canApprove = useCan("approve_refund");
  const refunds = useAdminOpsStore((state) => state.refunds);
  const updateRefundStatus = useAdminOpsStore((state) => state.updateRefundStatus);
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === "undefined") return refunds[0]?.id ?? "";
    return new URLSearchParams(window.location.search).get("refundId") ?? refunds[0]?.id ?? "";
  });
  const [statusFilter, setStatusFilter] = useState<RefundStatus | "all">("all");
  const [riskFilter, setRiskFilter] = useState<RefundRisk | "all">("all");
  const selected = refunds.find((item) => item.id === selectedId) ?? refunds[0];

  const filtered = useMemo(() => {
    return refunds.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchRisk = riskFilter === "all" || item.risk === riskFilter;
      return matchStatus && matchRisk;
    });
  }, [refunds, riskFilter, statusFilter]);

  const stats = useMemo(() => {
    const pending = refunds.filter((item) => item.status === "pending").length;
    const review = refunds.filter((item) => item.status === "review").length;
    const riskHigh = refunds.filter((item) => item.risk === "high").length;
    const amount = refunds.reduce((sum, item) => sum + item.amount, 0);
    return { pending, review, riskHigh, amount };
  }, [refunds]);

  if (!selected) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "İade Zekası Merkezi" : "Refund Intelligence Hub"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Politika odaklı kararlar, risk sinyalleri ve istisna kuyruğu." : "Policy-driven decisions, risk signals and exception queue."}</p>
        </div>
        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          {tr ? "Vaka Raporu Dışa Aktar" : "Export Casebook"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label={tr ? "Bekleyen Vaka" : "Pending Cases"} value={stats.pending.toString()} />
        <Metric label={tr ? "İnceleme Altında" : "Under Review"} value={stats.review.toString()} />
        <Metric label={tr ? "Yüksek Risk" : "High Risk"} value={stats.riskHigh.toString()} />
        <Metric label={tr ? "Toplam Maruziyet" : "Total Exposure"} value={`$${stats.amount.toFixed(0)}`} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Filter active={statusFilter === "all"} label={tr ? "Tüm Durumlar" : "All Status"} onClick={() => setStatusFilter("all")} />
        <Filter active={statusFilter === "pending"} label={tr ? "Beklemede" : "Pending"} onClick={() => setStatusFilter("pending")} />
        <Filter active={statusFilter === "review"} label={tr ? "İncelemede" : "Review"} onClick={() => setStatusFilter("review")} />
        <Filter active={statusFilter === "approved"} label={tr ? "Onaylandı" : "Approved"} onClick={() => setStatusFilter("approved")} />
        <Filter active={statusFilter === "rejected"} label={tr ? "Reddedildi" : "Rejected"} onClick={() => setStatusFilter("rejected")} />
        <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-700" />
        <Filter active={riskFilter === "all"} label={tr ? "Tüm Riskler" : "All Risk"} onClick={() => setRiskFilter("all")} />
        <Filter active={riskFilter === "high"} label={tr ? "Yüksek Risk" : "High Risk"} onClick={() => setRiskFilter("high")} />
        <Filter active={riskFilter === "medium"} label={tr ? "Orta Risk" : "Medium Risk"} onClick={() => setRiskFilter("medium")} />
        <Filter active={riskFilter === "low"} label={tr ? "Düşük Risk" : "Low Risk"} onClick={() => setRiskFilter("low")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3">{tr ? "Vaka" : "Case"}</th>
                <th className="px-4 py-3">{tr ? "Sipariş" : "Order"}</th>
                <th className="px-4 py-3">{tr ? "Tutar" : "Amount"}</th>
                <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                <th className="px-4 py-3">Risk</th>
                <th className="px-4 py-3">{tr ? "Açık Süre" : "Open"}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(item.id)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.id}</p>
                    <p className="text-xs text-slate-500">{item.customer}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.order}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">${item.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><Pill label={tr ? statusText(item.status) : item.status} tone="neutral" /></td>
                  <td className="px-4 py-3"><Pill label={tr ? riskText(item.risk) : item.risk} tone={item.risk} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{item.hoursOpen ? `${item.hoursOpen}h` : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.id}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.order} • {selected.customerEmail}</p>
            <div className="mt-4 rounded-lg border border-slate-100 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {tr ? "Talep nedeni" : "Reason"}: {selected.reason}. {tr ? "Bu müşterinin önceki iade sayısı" : "Previous refunds by this customer"}: {selected.previousRefunds}.
            </div>
            <textarea className="mt-4 w-full rounded-lg border border-slate-200 p-3 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder={tr ? "İç notlar ve politika referansı..." : "Internal notes and policy reference..."} rows={3} />
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(tr ? `${selected.id} reddedilsin mi?` : `Reject ${selected.id}?`)) return;
                  updateRefundStatus(selected.id, "rejected", "Admin");
                }}
              >
                {tr ? "Reddet" : "Reject"}
              </button>
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(tr ? `${selected.id} onaylansın mı?` : `Approve ${selected.id}?`)) return;
                  updateRefundStatus(selected.id, "approved", "Admin");
                }}
              >
                {tr ? "Onayla" : "Approve"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tr ? "Karar Asistanı" : "Decision Assistant"}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "İadeden önce lisans aktivasyonunu kontrol edin." : "Check license activation before refund."}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "24 saat içinde mükerrer satın alma varsa: otomatik onay." : "If duplicate purchase within 24h: auto approve."}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Tekrarlayan talep + yüksek tutar varsa: eskale edin." : "If repeated claims + high amount: escalate."}</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function statusText(status: RefundStatus) {
  const map: Record<RefundStatus, string> = {
    pending: "beklemede",
    review: "incelemede",
    approved: "onaylandı",
    rejected: "reddedildi",
  };
  return map[status];
}

function riskText(risk: RefundRisk) {
  const map: Record<RefundRisk, string> = {
    high: "yüksek",
    medium: "orta",
    low: "düşük",
  };
  return map[risk];
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Filter({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

function Pill({ label, tone }: { label: string; tone: "low" | "medium" | "high" | "neutral" }) {
  const styles =
    tone === "high"
      ? "bg-red-100 text-red-700"
      : tone === "medium"
      ? "bg-amber-100 text-amber-700"
      : tone === "low"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}>{label}</span>;
}
