"use client";

import { useMemo, useState } from "react";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

export default function AdminAuditPage() {
  const auditTrail = useAdminOpsStore((state) => state.auditTrail);
  const restorePoints = useAdminOpsStore((state) => state.restorePoints);
  const refunds = useAdminOpsStore((state) => state.refunds);
  const payouts = useAdminOpsStore((state) => state.payouts);
  const rules = useAdminOpsStore((state) => state.rules);
  const automationLogs = useAdminOpsStore((state) => state.automationLogs);
  const modules = useAdminOpsStore((state) => state.moduleSubmissions);
  const feeds = useAdminOpsStore((state) => state.xmlFeeds);
  const templates = useAdminOpsStore((state) => state.xmlTemplates);
  const history = useAdminOpsStore((state) => state.history);
  const historyCount = useAdminOpsStore((state) => state.history.length);
  const undoLast = useAdminOpsStore((state) => state.undoLast);
  const restoreFromPoint = useAdminOpsStore((state) => state.restoreFromPoint);
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const list = auditTrail.slice(0, 100);
    if (actionFilter === "all") return list;
    return list.filter((entry) => entry.action === actionFilter);
  }, [actionFilter, auditTrail]);

  const selectedEntry = useMemo(
    () => (selectedId ? grouped.find((entry) => entry.id === selectedId) ?? null : grouped[0] ?? null),
    [grouped, selectedId]
  );

  const actions = useMemo(() => ["all", ...Array.from(new Set(auditTrail.map((entry) => entry.action)))], [auditTrail]);

  const undoPreview = useMemo(() => {
    const previous = history[0];
    if (!previous) return null;
    return {
      refundsDelta: previous.refunds.length - refunds.length,
      payoutsDelta: previous.payouts.length - payouts.length,
      rulesDelta: previous.rules.length - rules.length,
      logsDelta: previous.automationLogs.length - automationLogs.length,
      modulesDelta: (previous.moduleSubmissions?.length ?? 0) - modules.length,
      feedsDelta: (previous.xmlFeeds?.length ?? 0) - feeds.length,
      templatesDelta: (previous.xmlTemplates?.length ?? 0) - templates.length,
    };
  }, [automationLogs.length, feeds.length, history, modules.length, payouts.length, refunds.length, rules.length, templates.length]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Audit Timeline</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">All admin actions are recorded here with rollback support.</p>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          disabled={historyCount === 0}
          onClick={() => {
            if (!window.confirm("Undo last admin operation?")) return;
            undoLast("Admin");
          }}
        >
          Undo Last Action
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric label="Logged Actions" value={auditTrail.length.toString()} />
        <Metric label="Undo Snapshots" value={historyCount.toString()} />
        <Metric label="Last 24h Actors" value={String(new Set(auditTrail.map((a) => a.actor)).size)} />
      </div>

      {undoPreview && (
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Undo Preview</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-4">
            <Delta label="Refunds" delta={undoPreview.refundsDelta} />
            <Delta label="Payouts" delta={undoPreview.payoutsDelta} />
            <Delta label="Rules" delta={undoPreview.rulesDelta} />
            <Delta label="Logs" delta={undoPreview.logsDelta} />
            <Delta label="Modules" delta={undoPreview.modulesDelta} />
            <Delta label="Feeds" delta={undoPreview.feedsDelta} />
            <Delta label="Templates" delta={undoPreview.templatesDelta} />
          </div>
        </section>
      )}

      <div className="mb-3 flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${actionFilter === action ? "bg-primary text-white" : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
            onClick={() => setActionFilter(action)}
            type="button"
          >
            {action}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((entry) => (
                <tr key={entry.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(entry.id)}>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(entry.at).toLocaleString("tr-TR")}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.actor}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{entry.action}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{entry.target}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{entry.details}</td>
                </tr>
              ))}
              {grouped.length === 0 && (
                <tr>
                  <td className="h-24 px-4 text-center text-sm text-slate-500" colSpan={5}>No audit entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Restore Points</h3>
            <div className="mt-3 space-y-2">
              {restorePoints.slice(0, 5).map((point) => (
                <div key={point.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{point.label}</p>
                      <p className="text-xs text-slate-500">{new Date(point.createdAt).toLocaleString("tr-TR")} • {point.actor}</p>
                    </div>
                    <button
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      onClick={() => {
                        if (!window.confirm(`Apply restore point ${point.id}?`)) return;
                        restoreFromPoint(point.id, "Admin");
                      }}
                      type="button"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    Refunds {point.counts.refunds} • Payouts {point.counts.payouts} • Rules {point.counts.rules} • Logs {point.counts.logs} • Modules {point.counts.modules ?? 0} • Feeds {point.counts.feeds ?? 0} • Policies {point.counts.policies ?? 0}
                  </p>
                </div>
              ))}
              {restorePoints.length === 0 && <p className="text-sm text-slate-500">No restore points yet.</p>}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Entry Detail</h3>
            {selectedEntry ? (
              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                <p><span className="font-semibold">ID:</span> {selectedEntry.id}</p>
                <p><span className="font-semibold">Time:</span> {new Date(selectedEntry.at).toLocaleString("tr-TR")}</p>
                <p><span className="font-semibold">Actor:</span> {selectedEntry.actor}</p>
                <p><span className="font-semibold">Action:</span> {selectedEntry.action}</p>
                <p><span className="font-semibold">Target:</span> {selectedEntry.target}</p>
                <p><span className="font-semibold">Details:</span> {selectedEntry.details}</p>
                {selectedEntry.restorePointId && <p><span className="font-semibold">Restore Point:</span> {selectedEntry.restorePointId}</p>}

                {selectedEntry.changes.length > 0 && (
                  <div className="mt-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Diff</p>
                    <div className="space-y-2 text-xs">
                      {selectedEntry.changes.map((change, index) => (
                        <div key={`${change.field}-${index}`} className="rounded-md bg-slate-50 p-2 dark:bg-slate-800/60">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">{change.field}</p>
                          <p className="text-slate-500">{change.before} → {change.after}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No entry selected.</p>
            )}
          </section>
        </aside>
      </div>
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

function Delta({ label, delta }: { label: string; delta: number }) {
  const tone = delta === 0 ? "text-slate-500" : delta > 0 ? "text-emerald-600" : "text-red-600";
  const sign = delta > 0 ? "+" : "";
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${tone}`}>{sign}{delta}</p>
    </div>
  );
}
