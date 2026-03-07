"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildRiskEvents, RiskSeverity, RiskSource } from "@/lib/data/adminOps";
import { useMockData } from "@/lib/hooks/useMockData";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

export default function AdminRiskPage() {
  const { orders, isLoaded } = useMockData();
  const refunds = useAdminOpsStore((state) => state.refunds);
  const payouts = useAdminOpsStore((state) => state.payouts);
  const canRunScan = useCan("run_risk_scan");
  const [sourceFilter, setSourceFilter] = useState<RiskSource | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<RiskSeverity | "all">("all");

  const events = useMemo(() => buildRiskEvents(orders, refunds, payouts), [orders, payouts, refunds]);

  const filtered = useMemo(() => {
    return events.filter((item) => {
      const bySource = sourceFilter === "all" || item.source === sourceFilter;
      const bySeverity = severityFilter === "all" || item.severity === severityFilter;
      return bySource && bySeverity;
    });
  }, [events, severityFilter, sourceFilter]);

  const metrics = useMemo(() => {
    const high = events.filter((item) => item.severity === "high").length;
    const medium = events.filter((item) => item.severity === "medium").length;
    const blocked = 6;
    const preventedLoss = 18240;
    return { high, medium, blocked, preventedLoss };
  }, [events]);

  if (!isLoaded) return <div className="h-[400px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Risk Center</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Orders, refunds ve payouts risk sinyallerini tek timeline uzerinde yonetin.</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canRunScan}>
          Run Risk Scan
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label="High Alerts" value={metrics.high.toString()} />
        <Kpi label="Medium Alerts" value={metrics.medium.toString()} />
        <Kpi label="Auto Blocks (30d)" value={metrics.blocked.toString()} />
        <Kpi label="Prevented Loss" value={`$${metrics.preventedLoss.toLocaleString()}`} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Pill active={sourceFilter === "all"} label="All Sources" onClick={() => setSourceFilter("all")} />
        <Pill active={sourceFilter === "order"} label="Orders" onClick={() => setSourceFilter("order")} />
        <Pill active={sourceFilter === "refund"} label="Refunds" onClick={() => setSourceFilter("refund")} />
        <Pill active={sourceFilter === "payout"} label="Payouts" onClick={() => setSourceFilter("payout")} />
        <span className="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-700" />
        <Pill active={severityFilter === "all"} label="All Severity" onClick={() => setSeverityFilter("all")} />
        <Pill active={severityFilter === "high"} label="High" onClick={() => setSeverityFilter("high")} />
        <Pill active={severityFilter === "medium"} label="Medium" onClick={() => setSeverityFilter("medium")} />
        <Pill active={severityFilter === "low"} label="Low" onClick={() => setSeverityFilter("low")} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Risk Score</th>
                <th className="px-4 py-3">Age</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => (
                <tr key={event.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <Link className="text-sm font-semibold text-primary hover:underline" href={`/admin/risk/${event.id}`}>
                      {event.id}
                    </Link>
                    <p className="text-xs text-slate-500">{event.ref} • {event.reason}</p>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-slate-700 dark:text-slate-300">{event.source}</td>
                  <td className="px-4 py-3"><SeverityTag severity={event.severity} /></td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{event.score}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{event.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Mitigation Playbook</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Order score &gt; 80: hold fulfillment + verify identity.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Refund high-risk: force manual review.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Payout failures: move to exception queue.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent Actions</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Blocked suspicious order ORD-8A13</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Escalated refund RF-1042 to senior reviewer</p>
            </div>
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

function SeverityTag({ severity }: { severity: RiskSeverity }) {
  const style = severity === "high" ? "bg-red-100 text-red-700" : severity === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${style}`}>{severity}</span>;
}
