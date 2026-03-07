"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

type PolicyDraft = {
  coreCommission: string;
  premiumCommission: string;
  xmlCommission: string;
  minPayout: string;
  txFee: string;
  payoutRetry: string;
  refundAutoCap: string;
  reviewScoreThreshold: string;
  require2fa: boolean;
  xmlStrictMode: boolean;
  autoNoindexDrafts: boolean;
};

export default function AdminSettingsPage() {
  const policySettings = useAdminOpsStore((state) => state.policySettings);
  const auditTrail = useAdminOpsStore((state) => state.auditTrail);
  const restoreFromPoint = useAdminOpsStore((state) => state.restoreFromPoint);
  const savePolicySettings = useAdminOpsStore((state) => state.savePolicySettings);
  const runFullXmlSync = useAdminOpsStore((state) => state.runFullXmlSync);
  const [draft, setDraft] = useState<PolicyDraft>(() => ({
    coreCommission: policySettings.coreCommission,
    premiumCommission: policySettings.premiumCommission,
    xmlCommission: policySettings.xmlCommission,
    minPayout: policySettings.minPayout,
    txFee: policySettings.txFee,
    payoutRetry: policySettings.payoutRetry,
    refundAutoCap: policySettings.refundAutoCap,
    reviewScoreThreshold: policySettings.reviewScoreThreshold,
    require2fa: policySettings.require2fa,
    xmlStrictMode: policySettings.xmlStrictMode,
    autoNoindexDrafts: policySettings.autoNoindexDrafts,
  }));
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyActor, setHistoryActor] = useState("all");
  const [historyField, setHistoryField] = useState("all");
  const [historyWindow, setHistoryWindow] = useState<"all" | "7d" | "30d">("30d");

  const resetDraft = () => {
    setDraft({
      coreCommission: policySettings.coreCommission,
      premiumCommission: policySettings.premiumCommission,
      xmlCommission: policySettings.xmlCommission,
      minPayout: policySettings.minPayout,
      txFee: policySettings.txFee,
      payoutRetry: policySettings.payoutRetry,
      refundAutoCap: policySettings.refundAutoCap,
      reviewScoreThreshold: policySettings.reviewScoreThreshold,
      require2fa: policySettings.require2fa,
      xmlStrictMode: policySettings.xmlStrictMode,
      autoNoindexDrafts: policySettings.autoNoindexDrafts,
    });
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify({
      coreCommission: policySettings.coreCommission,
      premiumCommission: policySettings.premiumCommission,
      xmlCommission: policySettings.xmlCommission,
      minPayout: policySettings.minPayout,
      txFee: policySettings.txFee,
      payoutRetry: policySettings.payoutRetry,
      refundAutoCap: policySettings.refundAutoCap,
      reviewScoreThreshold: policySettings.reviewScoreThreshold,
      require2fa: policySettings.require2fa,
      xmlStrictMode: policySettings.xmlStrictMode,
      autoNoindexDrafts: policySettings.autoNoindexDrafts,
    });
  }, [draft, policySettings]);

  const policyHistory = useMemo(() => {
    const query = historyQuery.trim().toLowerCase();
    const list = auditTrail.filter((entry) => entry.action === "settings.policy.saved");
    const latestTimestamp = list.length > 0 ? new Date(list[0].at).getTime() : 0;
    return list
      .filter((entry) => {
        if (historyActor !== "all" && entry.actor !== historyActor) return false;
        if (historyField !== "all" && !entry.changes.some((change) => change.field === historyField)) return false;
        if (historyWindow !== "all") {
          const ageMs = latestTimestamp - new Date(entry.at).getTime();
          const max = historyWindow === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
          if (ageMs > max) return false;
        }
        if (!query) return true;
        return (
          entry.details.toLowerCase().includes(query) ||
          entry.actor.toLowerCase().includes(query) ||
          entry.changes.some((change) => `${change.field} ${change.before} ${change.after}`.toLowerCase().includes(query))
        );
      })
      .slice(0, 12);
  }, [auditTrail, historyActor, historyField, historyQuery, historyWindow]);

  const historyActors = useMemo(() => {
    return Array.from(new Set(auditTrail.filter((entry) => entry.action === "settings.policy.saved").map((entry) => entry.actor)));
  }, [auditTrail]);

  const historyFields = useMemo(() => {
    return Array.from(
      new Set(
        auditTrail
          .filter((entry) => entry.action === "settings.policy.saved")
          .flatMap((entry) => entry.changes.map((change) => change.field))
      )
    );
  }, [auditTrail]);

  const saveAll = () => {
    savePolicySettings(draft, "Admin");
    toast.success("Settings saved and queued for policy deployment.");
  };

  const applyRestorePoint = (restorePointId: string | undefined) => {
    if (!restorePointId) return;
    if (!window.confirm(`Apply restore point ${restorePointId}?`)) return;
    restoreFromPoint(restorePointId, "Admin");
    toast.success("Policy restore point applied.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Control Plane Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure governance, finance, catalog quality, XML integrations, SEO and communication policies.</p>
          <p className="mt-2 text-xs text-slate-500">Last updated: {new Date(policySettings.updatedAt).toLocaleString("tr-TR")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={!isDirty}
            onClick={resetDraft}
            type="button"
          >
            Reset Draft
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!isDirty} onClick={saveAll}>
            Save All Policies
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <QuickLink href="/admin/roles" label="Roles and Permissions" icon="admin_panel_settings" desc="View policies and role presets" />
        <QuickLink href="/admin/modules" label="Modules Release Lab" icon="deployed_code" desc="Review and release workflow" />
        <QuickLink href="/admin/xml" label="XML Integration Hub" icon="sync_alt" desc="Mapping templates and feed health" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6">
          <Panel title="Commission Matrix">
            <FieldRow label="Core Extensions (%)" value={draft.coreCommission} onChange={(value) => setDraft((prev) => ({ ...prev, coreCommission: value }))} />
            <FieldRow label="Premium Themes (%)" value={draft.premiumCommission} onChange={(value) => setDraft((prev) => ({ ...prev, premiumCommission: value }))} />
            <FieldRow label="XML Integrations (%)" value={draft.xmlCommission} onChange={(value) => setDraft((prev) => ({ ...prev, xmlCommission: value }))} />
          </Panel>

          <Panel title="Payout and Refund Guardrails">
            <FieldRow label="Minimum payout ($)" value={draft.minPayout} onChange={(value) => setDraft((prev) => ({ ...prev, minPayout: value }))} />
            <FieldRow label="Transaction fee ($)" value={draft.txFee} onChange={(value) => setDraft((prev) => ({ ...prev, txFee: value }))} />
            <FieldRow label="Payout retry limit" value={draft.payoutRetry} onChange={(value) => setDraft((prev) => ({ ...prev, payoutRetry: value }))} />
            <FieldRow label="Auto-refund cap ($)" value={draft.refundAutoCap} onChange={(value) => setDraft((prev) => ({ ...prev, refundAutoCap: value }))} />
          </Panel>

          <Panel title="Catalog and Moderation Policy">
            <FieldRow label="Risk score threshold for manual review" value={draft.reviewScoreThreshold} onChange={(value) => setDraft((prev) => ({ ...prev, reviewScoreThreshold: value }))} />
            <ToggleRow
              checked={draft.require2fa}
              description="All admin roles must pass 2FA for sensitive actions."
              label="Mandatory 2FA for admin actions"
              onChange={(value) => setDraft((prev) => ({ ...prev, require2fa: value }))}
            />
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">First release requires QA + security checks.</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Rejected submissions auto-notify developer with diff notes.</p>
            </div>
          </Panel>

          <Panel title="XML Integration Controls">
            <ToggleRow
              checked={draft.xmlStrictMode}
              description="Reject malformed feeds and force schema validation."
              label="Strict schema mode"
              onChange={(value) => setDraft((prev) => ({ ...prev, xmlStrictMode: value }))}
            />
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <ActionButton label="Rebuild mappings" onClick={() => toast.success("Mapping rebuild job queued.")} />
              <ActionButton label="Re-run failed syncs" onClick={() => {
                runFullXmlSync("Admin");
                toast.success("Failed sync re-run queued.");
              }} />
              <ActionButton label="Open retry queue" onClick={() => toast.info("Use XML Hub to inspect retry queue.")}
              />
              <ActionButton label="Export feed diagnostics" onClick={() => toast.success("Diagnostics export started.")} />
            </div>
          </Panel>
        </section>

        <aside className="space-y-6">
          <Panel title="Policy History">
            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                onChange={(event) => setHistoryQuery(event.target.value)}
                placeholder="Search actor, field, or value..."
                value={historyQuery}
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryActor(event.target.value)}
                  value={historyActor}
                >
                  <option value="all">All Actors</option>
                  {historyActors.map((actor) => (
                    <option key={actor} value={actor}>{actor}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryField(event.target.value)}
                  value={historyField}
                >
                  <option value="all">All Fields</option>
                  {historyFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryWindow(event.target.value as "all" | "7d" | "30d")}
                  value={historyWindow}
                >
                  <option value="all">All Time</option>
                  <option value="30d">30d</option>
                  <option value="7d">7d</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              {policyHistory.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.details}</p>
                      <p className="text-xs text-slate-500">{new Date(entry.at).toLocaleString("tr-TR")} • {entry.actor}</p>
                    </div>
                    {entry.restorePointId && (
                      <button
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={() => applyRestorePoint(entry.restorePointId)}
                        type="button"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.changes.slice(0, 4).map((change, index) => (
                      <span key={`${change.field}-${index}`} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {change.field}: {change.before} → {change.after}
                      </span>
                    ))}
                    {entry.changes.length > 4 && <span className="text-[11px] text-slate-500">+{entry.changes.length - 4} more</span>}
                  </div>
                </div>
              ))}
              {policyHistory.length === 0 && <p className="text-sm text-slate-500">No saved policy revisions yet.</p>}
            </div>
          </Panel>

          <Panel title="Growth and SEO Defaults">
            <ToggleRow
              checked={draft.autoNoindexDrafts}
              description="Apply noindex to draft or scheduled blog content."
              label="Auto noindex for drafts"
              onChange={(value) => setDraft((prev) => ({ ...prev, autoNoindexDrafts: value }))}
            />
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">UTM naming convention: `channel_source_campaign`</p>
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">Canonical enforcement: marketplace pages only</p>
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">Blog internal link minimum: 3 links/post</p>
            </div>
          </Panel>

          <Panel title="Notification Matrix">
            <NotificationRow event="High-risk refund" teams="Ops, Finance" channel="In-app + Email" />
            <NotificationRow event="Failed payout retries" teams="Finance" channel="In-app + Slack" />
            <NotificationRow event="XML feed blocked" teams="Ops" channel="Pager + In-app" />
            <NotificationRow event="SEO critical issue" teams="Growth, Content" channel="In-app" />
          </Panel>

          <Panel title="Policy Shortcuts">
            <div className="space-y-2">
              <Shortcut href="/admin/audit" icon="history" label="Review policy changes in audit trail" />
              <Shortcut href="/admin/automations" icon="automation" label="Tune automation guardrails" />
              <Shortcut href="/admin/risk" icon="gpp_maybe" label="Adjust risk scans and severity models" />
              <Shortcut href="/admin/marketing" icon="campaign" label="Open campaign governance panel" />
              <Shortcut href="/admin/seo" icon="travel_explore" label="Open SEO sprint board" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldRow({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mb-3 flex items-center justify-between text-sm last:mb-0">
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <input
        className="w-24 rounded-md border border-slate-200 px-2.5 py-1.5 text-right dark:border-slate-700 dark:bg-slate-800"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="mb-3 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <button
          className={`rounded-full px-3 py-1 text-xs font-semibold ${checked ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
          onClick={() => onChange(!checked)}
          type="button"
        >
          {checked ? "Enabled" : "Disabled"}
        </button>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" onClick={onClick} type="button">
      {label}
    </button>
  );
}

function NotificationRow({ event, teams, channel }: { event: string; teams: string; channel: string }) {
  return (
    <div className="mb-2 rounded-lg border border-slate-100 p-3 text-sm last:mb-0 dark:border-slate-800">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{event}</p>
      <p className="text-xs text-slate-500">Teams: {teams}</p>
      <p className="text-xs text-slate-500">Channel: {channel}</p>
    </div>
  );
}

function QuickLink({ href, label, icon, desc }: { href: string; label: string; icon: string; desc: string }) {
  return (
    <Link className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/50" href={href}>
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      </div>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </Link>
  );
}

function Shortcut({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {label}
      </span>
      <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
    </Link>
  );
}
