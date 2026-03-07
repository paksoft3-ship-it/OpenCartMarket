"use client";

import { useMemo, useState } from "react";
import { PayoutQueue, PayoutStatus } from "@/lib/data/adminOps";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

export default function AdminPayoutsPage() {
  const canApprove = useCan("approve_payout");
  const canRunSettlement = useCan("run_settlement");
  const payouts = useAdminOpsStore((state) => state.payouts);
  const updatePayoutStatus = useAdminOpsStore((state) => state.updatePayoutStatus);
  const retryPayout = useAdminOpsStore((state) => state.retryPayout);
  const [queueFilter, setQueueFilter] = useState<PayoutQueue>("all");
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === "undefined") return payouts[0]?.id ?? "";
    return new URLSearchParams(window.location.search).get("payoutId") ?? payouts[0]?.id ?? "";
  });
  const selected = payouts.find((item) => item.id === selectedId) ?? payouts[0];

  const filtered = useMemo(() => {
    return payouts.filter((item) => (queueFilter === "all" ? true : item.queue === queueFilter));
  }, [payouts, queueFilter]);

  const metrics = useMemo(() => {
    const pendingAmount = payouts.filter((item) => item.status === "Beklemede" || item.status === "İncelemede").reduce((sum, item) => sum + item.amount, 0);
    const exceptionCount = payouts.filter((item) => item.queue === "exception").length;
    const fees = payouts.reduce((sum, item) => sum + item.fee, 0);
    return { pendingAmount, exceptionCount, fees };
  }, [payouts]);

  if (!selected) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Payout Engine Console</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Queue-based odeme yonetimi, reconciliation ve exception handling.</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canRunSettlement}>
          Run Settlement Batch
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label="Bekleyen Tutar" value={`₺${metrics.pendingAmount.toLocaleString()}`} />
        <Kpi label="Exception Queue" value={metrics.exceptionCount.toString()} />
        <Kpi label="Toplam Islem Ucreti" value={`₺${metrics.fees.toLocaleString()}`} />
        <Kpi label="Auto Settlement Ratio" value="71%" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <QueuePill active={queueFilter === "all"} label="All Queue" onClick={() => setQueueFilter("all")} />
        <QueuePill active={queueFilter === "manual"} label="Manual Review" onClick={() => setQueueFilter("manual")} />
        <QueuePill active={queueFilter === "auto"} label="Auto Approved" onClick={() => setQueueFilter("auto")} />
        <QueuePill active={queueFilter === "exception"} label="Exception" onClick={() => setQueueFilter("exception")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Talep</th>
                <th className="px-4 py-3">Geliştirici</th>
                <th className="px-4 py-3">Tutar</th>
                <th className="px-4 py-3">Queue</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Retry</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((request) => (
                <tr key={request.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(request.id)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{request.id}</p>
                    <p className="text-xs text-slate-500">{request.requestedAt} • {request.method}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{request.developer}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">₺{request.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><QueueTag queue={request.queue} /></td>
                  <td className="px-4 py-3"><StatusTag status={request.status} /></td>
                  <td className="px-4 py-3 text-sm text-slate-500">{request.retries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.id}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.developer}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <SmallMetric label="Amount" value={`₺${selected.amount.toLocaleString()}`} />
              <SmallMetric label="Fee" value={`₺${selected.fee}`} />
              <SmallMetric label="Status" value={selected.status} />
              <SmallMetric label="Queue" value={selected.queue} />
            </div>
            <div className="mt-4 rounded-lg border border-slate-100 p-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              Exception reason: {selected.reason}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(`Retry payout ${selected.id}?`)) return;
                  retryPayout(selected.id, "Admin");
                }}
              >
                Retry
              </button>
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(`Approve payout ${selected.id}?`)) return;
                  updatePayoutStatus(selected.id, "Onaylandı", "Admin");
                }}
              >
                Approve
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reconciliation Checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Net payout equals ledger balance.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Tax withholding applied for jurisdiction.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Failed transfers auto retried by policy.</li>
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

function QueuePill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

function QueueTag({ queue }: { queue: PayoutQueue }) {
  const style =
    queue === "exception"
      ? "bg-red-100 text-red-700"
      : queue === "manual"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{queue}</span>;
}

function StatusTag({ status }: { status: PayoutStatus }) {
  const style =
    status === "Basarisiz"
      ? "bg-red-100 text-red-700"
      : status === "Gonderildi"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>;
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
