"use client";

import { useMemo, useState } from "react";

type Segment = "new" | "vip" | "churn-risk" | "active";

const customers = [
  { id: "CUS-1042", name: "Arda Yilmaz", email: "arda@example.com", segment: "vip" as Segment, orders: 18, ltv: 1240, openTickets: 1, lastPurchase: "06 Mar 2026" },
  { id: "CUS-1041", name: "Zeynep Kaya", email: "zeynep@example.com", segment: "active" as Segment, orders: 6, ltv: 420, openTickets: 0, lastPurchase: "02 Mar 2026" },
  { id: "CUS-1040", name: "Mert Demir", email: "mert@example.com", segment: "churn-risk" as Segment, orders: 3, ltv: 180, openTickets: 2, lastPurchase: "15 Jan 2026" },
  { id: "CUS-1039", name: "Elif Aydin", email: "elif@example.com", segment: "new" as Segment, orders: 1, ltv: 49, openTickets: 0, lastPurchase: "05 Mar 2026" },
];

export default function AdminCustomersPage() {
  const [segmentFilter, setSegmentFilter] = useState<Segment | "all">("all");
  const [selectedId, setSelectedId] = useState(customers[0].id);
  const selected = customers.find((item) => item.id === selectedId) ?? customers[0];

  const filtered = useMemo(() => {
    return customers.filter((item) => (segmentFilter === "all" ? true : item.segment === segmentFilter));
  }, [segmentFilter]);

  const totals = useMemo(() => {
    const total = customers.length;
    const vip = customers.filter((item) => item.segment === "vip").length;
    const churnRisk = customers.filter((item) => item.segment === "churn-risk").length;
    const ltv = customers.reduce((sum, item) => sum + item.ltv, 0);
    return { total, vip, churnRisk, ltv };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Customer 360</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Segment, LTV, ticket durumu ve sonraki aksiyon onerileri.</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card label="Toplam Musteri" value={totals.total.toString()} />
        <Card label="VIP Segment" value={totals.vip.toString()} />
        <Card label="Churn Risk" value={totals.churnRisk.toString()} />
        <Card label="Toplam LTV" value={`$${totals.ltv.toLocaleString()}`} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <SegmentPill active={segmentFilter === "all"} label="All" onClick={() => setSegmentFilter("all")} />
        <SegmentPill active={segmentFilter === "vip"} label="VIP" onClick={() => setSegmentFilter("vip")} />
        <SegmentPill active={segmentFilter === "active"} label="Active" onClick={() => setSegmentFilter("active")} />
        <SegmentPill active={segmentFilter === "new"} label="New" onClick={() => setSegmentFilter("new")} />
        <SegmentPill active={segmentFilter === "churn-risk"} label="Churn Risk" onClick={() => setSegmentFilter("churn-risk")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Segment</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">LTV</th>
                <th className="px-4 py-3">Open Tickets</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(customer.id)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </td>
                  <td className="px-4 py-3"><SegmentTag value={customer.segment} /></td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{customer.orders}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">${customer.ltv}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{customer.openTickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{selected.email}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Mini label="Segment" value={selected.segment} />
              <Mini label="Orders" value={selected.orders.toString()} />
              <Mini label="LTV" value={`$${selected.ltv}`} />
              <Mini label="Last Purchase" value={selected.lastPurchase} />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recommended Next Action</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {selected.segment === "churn-risk"
                ? "Send retention offer + check unresolved ticket quality."
                : selected.segment === "vip"
                ? "Invite to beta modules and premium bundle campaign."
                : selected.segment === "new"
                ? "Trigger onboarding email and setup guide."
                : "Upsell relevant add-ons based on latest purchase."}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Send Email</button>
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90">Create Task</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function SegmentPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
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

function SegmentTag({ value }: { value: Segment }) {
  const style =
    value === "vip"
      ? "bg-purple-100 text-purple-700"
      : value === "churn-risk"
      ? "bg-red-100 text-red-700"
      : value === "new"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{value}</span>;
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
