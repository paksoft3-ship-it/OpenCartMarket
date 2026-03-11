"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PayoutQueue, PayoutStatus } from "@/lib/server/db/opsTypes";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

interface PayoutRequest {
  id: string;
  developer: string;
  amount: number;
  requestedAt: string;
  method: string;
  status: PayoutStatus;
  queue: PayoutQueue;
  reason: string;
  fee: number;
  retries: number;
}

export default function AdminPayoutsPage() {
  const language = useAdminLanguage();
  const tr = language === "tr";
  const canApprove = useCan("approve_payout");
  const canRunSettlement = useCan("run_settlement");

  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [queueFilter, setQueueFilter] = useState<PayoutQueue>("all");
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("payoutId") ?? "";
  });

  const load = async () => {
    try {
      const res = await fetch("/api/admin/payouts");
      if (res.ok) {
        const { items } = await res.json();
        setPayouts(items ?? []);
        if (!selectedId && items?.length > 0) setSelectedId(items[0].id);
      }
    } catch {
      toast.error(tr ? "Ödemeler yüklenemedi." : "Failed to load payouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const updateStatus = async (id: string, status: PayoutStatus) => {
    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      const updated: PayoutRequest = await res.json();
      setPayouts((prev) => prev.map((p) => p.id === id ? updated : p));
      toast.success(tr ? "Ödeme durumu güncellendi." : "Payout status updated.");
    } catch {
      toast.error(tr ? "Güncelleme başarısız." : "Update failed.");
    }
  };

  const retryPayout = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/payouts/${id}/retry`, {
        method: "POST",
        headers: { "x-admin-actor": "Admin" },
      });
      if (!res.ok) throw new Error();
      const updated: PayoutRequest = await res.json();
      setPayouts((prev) => prev.map((p) => p.id === id ? updated : p));
      toast.success(tr ? "Yeniden deneme başlatıldı." : "Retry initiated.");
    } catch {
      toast.error(tr ? "Yeniden deneme başarısız." : "Retry failed.");
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>;
  if (!selected) return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Ödeme Motoru Konsolu" : "Payout Engine Console"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Kuyruk tabanlı ödeme yönetimi, mutabakat ve istisna yönetimi." : "Queue-based payout operations, reconciliation and exception handling."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canRunSettlement}>
          {tr ? "Mutabakat Toplu İşlemini Çalıştır" : "Run Settlement Batch"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label={tr ? "Bekleyen Tutar" : "Pending Amount"} value={`₺${metrics.pendingAmount.toLocaleString()}`} />
        <Kpi label={tr ? "İstisna Kuyruğu" : "Exception Queue"} value={metrics.exceptionCount.toString()} />
        <Kpi label={tr ? "Toplam İşlem Ücreti" : "Total Processing Fee"} value={`₺${metrics.fees.toLocaleString()}`} />
        <Kpi label={tr ? "Otomatik Mutabakat Oranı" : "Auto Settlement Ratio"} value="71%" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <QueuePill active={queueFilter === "all"} label={tr ? "Tüm Kuyruklar" : "All Queue"} onClick={() => setQueueFilter("all")} />
        <QueuePill active={queueFilter === "manual"} label={tr ? "Manuel İnceleme" : "Manual Review"} onClick={() => setQueueFilter("manual")} />
        <QueuePill active={queueFilter === "auto"} label={tr ? "Otomatik Onay" : "Auto Approved"} onClick={() => setQueueFilter("auto")} />
        <QueuePill active={queueFilter === "exception"} label={tr ? "İstisna" : "Exception"} onClick={() => setQueueFilter("exception")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Talep" : "Request"}</th>
                <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
                <th className="px-4 py-3">{tr ? "Tutar" : "Amount"}</th>
                <th className="px-4 py-3">{tr ? "Kuyruk" : "Queue"}</th>
                <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                <th className="px-4 py-3">{tr ? "Yeniden Deneme" : "Retry"}</th>
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
                  <td className="px-4 py-3"><QueueTag queue={request.queue} tr={tr} /></td>
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
              <SmallMetric label={tr ? "Tutar" : "Amount"} value={`₺${selected.amount.toLocaleString()}`} />
              <SmallMetric label={tr ? "Ücret" : "Fee"} value={`₺${selected.fee}`} />
              <SmallMetric label={tr ? "Durum" : "Status"} value={selected.status} />
              <SmallMetric label={tr ? "Kuyruk" : "Queue"} value={queueText(selected.queue, tr)} />
            </div>
            <div className="mt-4 rounded-lg border border-slate-100 p-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {tr ? "İstisna sebebi" : "Exception reason"}: {selected.reason}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(tr ? `${selected.id} ödemesi yeniden denensin mi?` : `Retry payout ${selected.id}?`)) return;
                  retryPayout(selected.id);
                }}
              >
                {tr ? "Yeniden Dene" : "Retry"}
              </button>
              <button
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
                disabled={!canApprove}
                onClick={() => {
                  if (!window.confirm(tr ? `${selected.id} ödemesi onaylansın mı?` : `Approve payout ${selected.id}?`)) return;
                  updateStatus(selected.id, "Onaylandı");
                }}
              >
                {tr ? "Onayla" : "Approve"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tr ? "Mutabakat Kontrol Listesi" : "Reconciliation Checklist"}</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Net ödeme defter bakiyesi ile eşleşiyor." : "Net payout equals ledger balance."}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Yasal bölgeye göre vergi kesintisi uygulandı." : "Tax withholding applied for jurisdiction."}</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Başarısız transferler politika gereği otomatik tekrarlandı." : "Failed transfers auto retried by policy."}</li>
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

function queueText(queue: PayoutQueue, tr: boolean) {
  if (!tr) return queue;
  if (queue === "manual") return "manuel";
  if (queue === "auto") return "otomatik";
  if (queue === "exception") return "istisna";
  return "tümü";
}

function QueueTag({ queue, tr }: { queue: PayoutQueue; tr: boolean }) {
  const style =
    queue === "exception"
      ? "bg-red-100 text-red-700"
      : queue === "manual"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{queueText(queue, tr)}</span>;
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
