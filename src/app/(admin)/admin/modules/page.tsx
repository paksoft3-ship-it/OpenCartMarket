"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

type ModuleStage = "review" | "qa" | "release" | "released" | "blocked";
type ModuleRisk = "low" | "medium" | "high";

interface ModuleSubmission {
  id: string;
  name: string;
  type: string;
  owner: string;
  stage: ModuleStage;
  risk: ModuleRisk;
  createdAt: string;
}

const compatibility = [
  { version: "4.0.2.3", pass: 93, blocked: 2 },
  { version: "4.0.2.2", pass: 88, blocked: 5 },
  { version: "3.0.3.9", pass: 81, blocked: 9 },
];

export default function AdminModulesPage() {
  const tr = useAdminLanguage() === "tr";
  const canManage = useCan("manage_modules");

  const [modules, setModules] = useState<ModuleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const selected = modules.find((item) => item.id === selectedId) ?? modules[0];

  const load = async () => {
    try {
      const res = await fetch("/api/admin/modules");
      if (res.ok) {
        const { items } = await res.json();
        setModules(items ?? []);
        if (!selectedId && items?.length > 0) setSelectedId(items[0].id);
      }
    } catch {
      toast.error(tr ? "Modüller yüklenemedi." : "Failed to load modules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const metrics = useMemo(() => {
    const inReview = modules.filter((item) => item.stage === "review").length;
    const blocked = modules.filter((item) => item.stage === "blocked").length;
    const ready = modules.filter((item) => item.stage === "release").length;
    return { inReview, blocked, ready, avgCycle: "3.4d" };
  }, [modules]);

  const updateStage = async (stage: ModuleStage) => {
    if (!selected || !canManage) {
      toast.error(tr ? "Mevcut görünüm modülleri yönetemez." : "Current view cannot manage modules.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/modules/${selected.id}/stage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ stage }),
      });
      if (!res.ok) throw new Error();
      const updated: ModuleSubmission = await res.json();
      setModules((prev) => prev.map((m) => m.id === selected.id ? updated : m));
      toast.success(tr ? `${selected.id} ${stage} aşamasına taşındı.` : `${selected.id} moved to ${stage}.`);
    } catch {
      toast.error(tr ? "Güncelleme başarısız." : "Update failed.");
    }
  };

  const updateRisk = async (risk: ModuleRisk) => {
    if (!selected || !canManage) {
      toast.error(tr ? "Mevcut görünüm modülleri yönetemez." : "Current view cannot manage modules.");
      return;
    }
    try {
      const res = await fetch(`/api/admin/modules/${selected.id}/risk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ risk }),
      });
      if (!res.ok) throw new Error();
      const updated: ModuleSubmission = await res.json();
      setModules((prev) => prev.map((m) => m.id === selected.id ? updated : m));
      toast.success(tr ? `${selected.id} risk seviyesi ${risk} olarak ayarlandı.` : `${selected.id} risk set to ${risk}.`);
    } catch {
      toast.error(tr ? "Güncelleme başarısız." : "Update failed.");
    }
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Modül Yayın Laboratuvarı" : "Modules Release Lab"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Başvuru triage, QA kapıları, uyumluluk takibi ve yayın hattı kontrolü." : "Submission triage, QA gates, compatibility tracking and release train control."}</p>
        </div>
        <button
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          disabled={!canManage}
          onClick={() => {
            if (!window.confirm(tr ? "Yayına hazır modüllerden release batch oluşturulsun mu?" : "Create release batch from ready modules?")) return;
            toast.success(tr ? "Release batch oluşturuldu." : "Release batch created.");
          }}
        >
          {tr ? "Release Batch Oluştur" : "Create Release Batch"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi label={tr ? "İncelemede" : "In Review"} value={String(metrics.inReview)} />
        <Kpi label={tr ? "QA Engelli" : "QA Blocked"} value={String(metrics.blocked)} />
        <Kpi label={tr ? "Yayına Hazır" : "Ready to Release"} value={String(metrics.ready)} />
        <Kpi label={tr ? "Ort. Döngü Süresi" : "Avg Cycle Time"} value={metrics.avgCycle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Başvuru Kuyruğu" : "Submission Queue"}</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Modül" : "Module"}</th>
                <th className="px-4 py-3">{tr ? "Tür" : "Type"}</th>
                <th className="px-4 py-3">{tr ? "Sorumlu" : "Owner"}</th>
                <th className="px-4 py-3">{tr ? "Aşama" : "Stage"}</th>
                <th className="px-4 py-3">{tr ? "Risk" : "Risk"}</th>
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
                  <td className="px-4 py-3 text-sm capitalize text-slate-700 dark:text-slate-300">{tr ? typeText(item.type) : item.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.owner}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{tr ? stageText(item.stage) : item.stage}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.risk === "high" ? "bg-red-100 text-red-700" : item.risk === "medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {tr ? riskText(item.risk) : item.risk}
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
                <ActionButton disabled={!canManage} label={tr ? "QA Aşamasına Taşı" : "Move to QA"} onClick={() => updateStage("qa")} />
                <ActionButton disabled={!canManage} label={tr ? "Yayın Aşamasına Taşı" : "Move to Release"} onClick={() => updateStage("release")} />
                <ActionButton disabled={!canManage} label={tr ? "Yayınlandı Olarak İşaretle" : "Mark Released"} onClick={() => updateStage("released")} />
                <ActionButton disabled={!canManage} label={tr ? "Engellendi Olarak İşaretle" : "Mark Blocked"} onClick={() => updateStage("blocked")} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <RiskButton active={selected.risk === "low"} disabled={!canManage} label={tr ? "Düşük" : "Low"} onClick={() => updateRisk("low")} />
                <RiskButton active={selected.risk === "medium"} disabled={!canManage} label={tr ? "Orta" : "Medium"} onClick={() => updateRisk("medium")} />
                <RiskButton active={selected.risk === "high"} disabled={!canManage} label={tr ? "Yüksek" : "High"} onClick={() => updateRisk("high")} />
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Uyumluluk Isı Haritası" : "Compatibility Heatmap"}</h3>
            <div className="mt-4 space-y-2">
              {compatibility.map((row) => (
                <div key={row.version} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.version}</p>
                    <p className="text-xs text-slate-500">{tr ? "Engelli" : "Blocked"} {row.blocked}</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.pass}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{tr ? "Geçiş" : "Pass"} {row.pass}%</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function stageText(stage: ModuleStage) {
  const map: Record<ModuleStage, string> = {
    review: "inceleme",
    qa: "qa",
    release: "yayın",
    released: "yayınlandı",
    blocked: "engellendi",
  };
  return map[stage];
}

function riskText(risk: ModuleRisk) {
  return risk === "high" ? "yüksek" : risk === "medium" ? "orta" : "düşük";
}

function typeText(type: string) {
  const map: Record<string, string> = {
    checkout: "checkout",
    theme: "tema",
    integration: "entegrasyon",
  };
  return map[type] ?? type;
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
