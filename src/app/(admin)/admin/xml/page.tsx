"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore, XmlFeedStatus } from "@/lib/store/adminOpsStore";

export default function AdminXmlPage() {
  const canManage = useCan("manage_xml");
  const feeds = useAdminOpsStore((state) => state.xmlFeeds);
  const templates = useAdminOpsStore((state) => state.xmlTemplates);
  const retryXmlFeed = useAdminOpsStore((state) => state.retryXmlFeed);
  const runFullXmlSync = useAdminOpsStore((state) => state.runFullXmlSync);
  const improveTemplate = useAdminOpsStore((state) => state.improveXmlTemplateCoverage);
  const [selectedId, setSelectedId] = useState(feeds[0]?.id ?? "");
  const selected = feeds.find((feed) => feed.id === selectedId) ?? feeds[0];

  const metrics = useMemo(() => {
    const active = feeds.filter((feed) => feed.status === "healthy").length;
    const degraded = feeds.filter((feed) => feed.status === "degraded").length;
    const failedMappings = feeds.reduce((sum, feed) => sum + feed.errors, 0);
    const avgSyncDelay = "54s";
    return { active, degraded, failedMappings, avgSyncDelay };
  }, [feeds]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">XML Integration Hub</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Provider connections, mapping templates, feed health and retry orchestration.</p>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          disabled={!canManage}
          onClick={() => {
            runFullXmlSync("Admin");
            toast.success("Full XML sync started.");
          }}
        >
          Run Full Sync
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label="Active Feeds" value={String(metrics.active)} />
        <Kpi label="Degraded Feeds" value={String(metrics.degraded)} />
        <Kpi label="Failed Mappings" value={String(metrics.failedMappings)} />
        <Kpi label="Avg Sync Delay" value={metrics.avgSyncDelay} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Partner Feed Health</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Feed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Latency</th>
                <th className="px-4 py-3">Last Sync</th>
                <th className="px-4 py-3">Errors</th>
              </tr>
            </thead>
            <tbody>
              {feeds.map((feed) => (
                <tr
                  key={feed.id}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  onClick={() => setSelectedId(feed.id)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{feed.partner}</p>
                    <p className="text-xs text-slate-500">{feed.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={feed.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{feed.latency}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{feed.lastSync}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{feed.errors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          {selected && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selected.partner}</h3>
              <p className="mt-1 text-xs text-slate-500">{selected.id} • retries {selected.retries}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <ActionButton
                  disabled={!canManage}
                  label="Retry Feed"
                  onClick={() => {
                    retryXmlFeed(selected.id, "Admin");
                    toast.success(`${selected.id} retry queued.`);
                  }}
                />
                <ActionButton
                  disabled={!canManage}
                  label="Run Global Sync"
                  onClick={() => {
                    runFullXmlSync("Admin");
                    toast.success("Global sync triggered.");
                  }}
                />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Mapping Templates</h3>
            <div className="mt-3 space-y-2">
              {templates.map((template) => (
                <div key={template.name} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{template.name}</p>
                      <p className="text-xs text-slate-500">{template.mapped}</p>
                      <p className="text-xs text-emerald-600">{template.coverage}% coverage</p>
                    </div>
                    <button
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      disabled={!canManage || template.coverage >= 100}
                      onClick={() => {
                        improveTemplate(template.name, "Admin");
                        toast.success(`${template.name} coverage improved.`);
                      }}
                      type="button"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              ))}
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

function StatusBadge({ status }: { status: XmlFeedStatus }) {
  const tone = status === "healthy" ? "bg-emerald-100 text-emerald-700" : status === "degraded" ? "bg-amber-100 text-amber-700" : status === "syncing" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{status}</span>;
}

function ActionButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
