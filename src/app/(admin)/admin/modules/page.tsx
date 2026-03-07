"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCan } from "@/components/admin/AdminAccessContext";
import { ModuleRisk, ModuleStage, useAdminOpsStore } from "@/lib/store/adminOpsStore";

const compatibility = [
  { version: "4.0.2.3", pass: 93, blocked: 2 },
  { version: "4.0.2.2", pass: 88, blocked: 5 },
  { version: "3.0.3.9", pass: 81, blocked: 9 },
];

export default function AdminModulesPage() {
  const canManage = useCan("manage_modules");
  const modules = useAdminOpsStore((state) => state.moduleSubmissions);
  const setModuleStage = useAdminOpsStore((state) => state.setModuleStage);
  const setModuleRisk = useAdminOpsStore((state) => state.setModuleRisk);
  const createReleaseBatch = useAdminOpsStore((state) => state.createReleaseBatch);
  const [selectedId, setSelectedId] = useState(modules[0]?.id ?? "");
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];

  const metrics = useMemo(() => {
    const inReview = modules.filter((item) => item.stage === "review").length;
    const blocked = modules.filter((item) => item.stage === "blocked").length;
    const ready = modules.filter((item) => item.stage === "release").length;
    const avgCycle = "3.4d";
    return { inReview, blocked, ready, avgCycle };
  }, [modules]);

  const updateStage = (stage: ModuleStage) => {
    if (!selected || !canManage) {
      toast.error("Current view cannot manage modules.");
      return;
    }
    setModuleStage(selected.id, stage, "Admin");
    toast.success(`${selected.id} moved to ${stage}.`);
  };

  const updateRisk = (risk: ModuleRisk) => {
    if (!selected || !canManage) {
      toast.error("Current view cannot manage modules.");
      return;
    }
    setModuleRisk(selected.id, risk, "Admin");
    toast.success(`${selected.id} risk set to ${risk}.`);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Modules Release Lab</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Submission triage, QA gates, compatibility tracking and release train control.</p>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          disabled={!canManage}
          onClick={() => {
            if (!window.confirm("Create release batch from ready modules?")) return;
            createReleaseBatch("Admin");
            toast.success("Release batch created.");
          }}
        >
          Create Release Batch
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label="In Review" value={String(metrics.inReview)} />
        <Kpi label="QA Blocked" value={String(metrics.blocked)} />
        <Kpi label="Ready to Release" value={String(metrics.ready)} />
        <Kpi label="Avg Cycle Time" value={metrics.avgCycle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Submission Queue</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  onClick={() => setSelectedId(item.id)}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-slate-700 dark:text-slate-300">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.owner}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.stage}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.risk === "high" ? "bg-red-100 text-red-700" : item.risk === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-6">
          {selected && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{selected.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{selected.id} • {selected.owner}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ActionButton disabled={!canManage} label="Move to QA" onClick={() => updateStage("qa")} />
                <ActionButton disabled={!canManage} label="Move to Release" onClick={() => updateStage("release")} />
                <ActionButton disabled={!canManage} label="Mark Released" onClick={() => updateStage("released")} />
                <ActionButton disabled={!canManage} label="Mark Blocked" onClick={() => updateStage("blocked")} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <RiskButton active={selected.risk === "low"} disabled={!canManage} label="Low" onClick={() => updateRisk("low")} />
                <RiskButton active={selected.risk === "medium"} disabled={!canManage} label="Medium" onClick={() => updateRisk("medium")} />
                <RiskButton active={selected.risk === "high"} disabled={!canManage} label="High" onClick={() => updateRisk("high")} />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Compatibility Heatmap</h3>
            <div className="mt-4 space-y-2">
              {compatibility.map((row) => (
                <div key={row.version} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.version}</p>
                    <p className="text-xs text-slate-500">Blocked {row.blocked}</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.pass}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Pass {row.pass}%</p>
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

function RiskButton({ label, onClick, active, disabled }: { label: string; onClick: () => void; active: boolean; disabled?: boolean }) {
  return (
    <button
      className={`rounded-lg px-3 py-2 text-xs font-semibold ${active ? "bg-primary text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"} disabled:opacity-50`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
