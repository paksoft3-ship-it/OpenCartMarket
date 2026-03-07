"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

export default function AdminAutomationsPage() {
  const canCreate = useCan("create_automation");
  const canSimulate = useCan("simulate_automation");
  const canEdit = useCan("edit_automation");

  const rules = useAdminOpsStore((state) => state.rules);
  const logs = useAdminOpsStore((state) => state.automationLogs);
  const createRule = useAdminOpsStore((state) => state.createRule);
  const toggleRule = useAdminOpsStore((state) => state.toggleRule);
  const deleteRule = useAdminOpsStore((state) => state.deleteRule);
  const simulateRule = useAdminOpsStore((state) => state.simulateRule);
  const [selectedId, setSelectedId] = useState("AUT-101");
  const [conditions, setConditions] = useState(["refund.amount > 100"]);
  const [actions, setActions] = useState(["require manager approval"]);
  const selected = useMemo(() => rules.find((rule) => rule.id === selectedId) ?? rules[0], [rules, selectedId]);

  if (!selected) return null;

  const runSimulation = () => {
    if (!canSimulate) {
      toast.error("Current view cannot simulate rules.");
      return;
    }
    if (!selected) return;
    simulateRule(selected.id, selected.status === "active" ? "success" : "skipped", "Admin");
    toast.success(`Simulation completed for ${selected.id}`);
  };

  const addRuleFromBuilder = () => {
    if (!canCreate) {
      toast.error("Current view cannot create automation rules.");
      return;
    }
    if (!window.confirm("Create a new rule from current builder blocks?")) return;
    const newRule = {
      id: `AUT-${Math.floor(110 + Math.random() * 900)}`,
      name: `Custom Rule ${rules.length + 1}`,
      trigger: conditions.join(" AND "),
      action: actions.join(" + "),
      status: "active" as const,
      runs: 0,
    };
    createRule(newRule, "Admin");
    setSelectedId(newRule.id);
    toast.success("Rule created from builder.");
  };

  const toggleSelectedRule = () => {
    if (!canEdit || !selected) {
      toast.error("Current view cannot edit rules.");
      return;
    }
    if (!window.confirm(`Toggle status for ${selected.id}?`)) return;
    toggleRule(selected.id, "Admin");
    toast.success("Rule status updated.");
  };

  const deleteSelectedRule = () => {
    if (!canEdit || !selected) {
      toast.error("Current view cannot delete rules.");
      return;
    }
    if (rules.length <= 1) {
      toast.error("At least one rule should remain.");
      return;
    }
    if (!window.confirm(`Delete ${selected.id}? This can be undone from Audit.`)) return;
    const next = rules.filter((rule) => rule.id !== selected.id);
    deleteRule(selected.id, "Admin");
    setSelectedId(next[0]?.id ?? "AUT-101");
    toast.success("Rule deleted.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Automation Rules</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">If-this-then-that workflow builder for Ops, Finance, Growth and Support.</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canCreate} onClick={addRuleFromBuilder}>
          New Rule
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Metric label="Active Rules" value="18" />
        <Metric label="Paused Rules" value="5" />
        <Metric label="Executions (30d)" value="1,284" />
        <Metric label="Estimated Hours Saved" value="94h" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Runs</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedId(rule.id)}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{rule.name}</p>
                    <p className="text-xs text-slate-500">{rule.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{rule.trigger}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{rule.action}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${rule.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {rule.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{rule.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selected.name}</h2>
            <p className="mt-2 text-xs uppercase tracking-wider text-slate-500">Trigger</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selected.trigger}</p>
            <p className="mt-3 text-xs uppercase tracking-wider text-slate-500">Action</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selected.action}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800" disabled={!canSimulate} onClick={runSimulation}>
                Simulate
              </button>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canEdit}>
                Edit Rule
              </button>
              <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800" disabled={!canEdit} onClick={toggleSelectedRule}>
                Toggle Status
              </button>
              <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" disabled={!canEdit} onClick={deleteSelectedRule}>
                Delete
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rule Builder</h3>
            <p className="mt-1 text-xs text-slate-500">Design condition + action chains visually.</p>

            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Conditions</p>
              <div className="mt-2 space-y-2">
                {conditions.map((condition, index) => (
                  <div key={`${condition}-${index}`} className="rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    IF {condition}
                  </div>
                ))}
              </div>
              <button
                className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => setConditions((prev) => [...prev, "customer.segment = churn-risk"])}
                type="button"
              >
                Add Condition
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Actions</p>
              <div className="mt-2 space-y-2">
                {actions.map((action, index) => (
                  <div key={`${action}-${index}`} className="rounded-lg border border-slate-100 px-3 py-2 text-xs text-slate-700 dark:border-slate-800 dark:text-slate-200">
                    THEN {action}
                  </div>
                ))}
              </div>
              <button
                className="mt-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                onClick={() => setActions((prev) => [...prev, "assign to ops manager"])}
                type="button"
              >
                Add Action
              </button>
              <button className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canCreate} onClick={addRuleFromBuilder} type="button">
                Save As Rule
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Common Templates</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">If refund amount &gt; $100 then manager approval required.</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">If payout fails 2x then move to exception queue.</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">If ticket SLA under 2h then auto escalate.</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Execution Logs</h3>
            <div className="mt-3 space-y-2 text-sm">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-200">{log.rule}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${log.result === "success" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{log.result}</span>
                  <span className="text-xs text-slate-500">{log.at}</span>
                </div>
              ))}
            </div>
          </div>
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
