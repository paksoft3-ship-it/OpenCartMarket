"use client";

import { useMemo, useState } from "react";
import { useMockData } from "@/lib/hooks/useMockData";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

type RiskLevel = "low" | "medium" | "high";

type OrderView = {
  id: string;
  date: string;
  customerEmail: string;
  status: "completed" | "pending" | "failed";
  total: number;
  items: number;
  risk: RiskLevel;
  slaHours: number;
};

export default function AdminOrdersPage() {
  const { orders, isLoaded } = useMockData();
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending" | "failed">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("orderId");
  });

  const enrichedOrders = useMemo<OrderView[]>(() => {
    return orders.map((order, index) => {
      const bucket = Number(order.id.replace(/\D/g, "").slice(-3) || index) % 1000;
      const customerEmail = `customer${bucket}@ocmarket.com`;
      const risk: RiskLevel =
        order.status === "failed" || order.total > 180 ? "high" : order.total > 90 || order.status === "pending" ? "medium" : "low";
      const slaHours = order.status === "pending" ? (bucket % 10) + 1 : 0;
      return {
        id: order.id,
        date: new Date(order.date).toLocaleDateString("tr-TR"),
        customerEmail,
        status: order.status,
        total: order.total,
        items: order.items.length,
        risk,
        slaHours,
      };
    });
  }, [orders]);

  const filtered = useMemo(() => {
    return enrichedOrders.filter((order) => {
      const byStatus = statusFilter === "all" || order.status === statusFilter;
      const byRisk = riskFilter === "all" || order.risk === riskFilter;
      return byStatus && byRisk;
    });
  }, [enrichedOrders, riskFilter, statusFilter]);

  const selected = useMemo(
    () => (selectedId ? enrichedOrders.find((order) => order.id === selectedId) ?? null : null),
    [enrichedOrders, selectedId]
  );

  const stats = useMemo(() => {
    const total = enrichedOrders.length;
    const pending = enrichedOrders.filter((order) => order.status === "pending").length;
    const highRisk = enrichedOrders.filter((order) => order.risk === "high").length;
    const revenue = enrichedOrders.reduce((sum, order) => sum + order.total, 0);
    return { total, pending, highRisk, revenue };
  }, [enrichedOrders]);

  if (!isLoaded) return <div className="h-[400px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Orders Control Tower</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Siparis akisi, risk seviyesi ve operasyon SLA takibi.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Toplam Siparis" value={stats.total.toString()} />
        <Metric label="Bekleyen Islem" value={stats.pending.toString()} />
        <Metric label="Yuksek Risk" value={stats.highRisk.toString()} />
        <Metric label="Toplam Ciro" value={`$${stats.revenue.toFixed(0)}`} />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Pill active={statusFilter === "all"} label="Tum Durumlar" onClick={() => setStatusFilter("all")} />
        <Pill active={statusFilter === "completed"} label="Completed" onClick={() => setStatusFilter("completed")} />
        <Pill active={statusFilter === "pending"} label="Pending" onClick={() => setStatusFilter("pending")} />
        <Pill active={statusFilter === "failed"} label="Failed" onClick={() => setStatusFilter("failed")} />
        <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-700" />
        <Pill active={riskFilter === "all"} label="Tum Riskler" onClick={() => setRiskFilter("all")} />
        <Pill active={riskFilter === "low"} label="Low Risk" onClick={() => setRiskFilter("low")} />
        <Pill active={riskFilter === "medium"} label="Medium Risk" onClick={() => setRiskFilter("medium")} />
        <Pill active={riskFilter === "high"} label="High Risk" onClick={() => setRiskFilter("high")} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Lane title="Pending Queue" count={filtered.filter((order) => order.status === "pending").length} />
        <Lane title="Risk Review" count={filtered.filter((order) => order.risk === "high").length} />
        <Lane title="Completed Today" count={filtered.filter((order) => order.status === "completed").length} />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">SLA</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(order.id)}>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{order.id}</p>
                  <p className="text-xs text-slate-500">{order.date} • {order.items} item</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{order.customerEmail}</td>
                <td className="px-4 py-3"><Badge className="capitalize" variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${order.risk === "high" ? "bg-red-100 text-red-700" : order.risk === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {order.risk}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{order.slaHours ? `${order.slaHours}h` : "-"}</td>
                <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100">${order.total.toFixed(2)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="h-24 px-4 text-center text-sm text-slate-500" colSpan={6}>Filtreye uygun siparis yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Sheet onOpenChange={(open) => !open && setSelectedId(null)} open={Boolean(selected)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selected?.id ?? "Order Detail"}</SheetTitle>
            <SheetDescription>Order timeline, risk notes and next-best action.</SheetDescription>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 p-4">
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-xs text-slate-500">Customer</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{selected.customerEmail}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Status" value={selected.status} />
                <Detail label="Risk" value={selected.risk} />
                <Detail label="SLA" value={selected.slaHours ? `${selected.slaHours}h` : "-"} />
                <Detail label="Total" value={`$${selected.total.toFixed(2)}`} />
              </div>
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Action</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {selected.risk === "high"
                    ? "Risk incelemesi baslatin, odeme dogrulama adimlarini tamamlayin."
                    : selected.status === "pending"
                    ? "SLA asimi olmadan fulfillment ekibine yonlendirin."
                    : "Siparis tamamlandi, upsell e-posta akisini tetikleyin."}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Pill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

function Lane({ title, count }: { title: string; count: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-wider text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{count}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize">{value}</p>
    </div>
  );
}
