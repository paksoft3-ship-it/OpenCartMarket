import { create } from "zustand";
import { persist } from "zustand/middleware";
import { payoutRequests, PayoutRequest, PayoutStatus, refundCases, RefundCase, RefundStatus } from "@/lib/data/adminOps";

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  runs: number;
}

export interface AutomationLog {
  id: string;
  rule: string;
  result: "success" | "skipped" | "failed";
  at: string;
}

export type ModuleStage = "review" | "qa" | "release" | "released" | "blocked";
export type ModuleRisk = "low" | "medium" | "high";

export interface ModuleSubmission {
  id: string;
  name: string;
  type: string;
  owner: string;
  stage: ModuleStage;
  risk: ModuleRisk;
}

export type XmlFeedStatus = "healthy" | "degraded" | "blocked" | "syncing";

export interface XmlFeed {
  id: string;
  partner: string;
  status: XmlFeedStatus;
  latency: string;
  lastSync: string;
  errors: number;
  retries: number;
}

export interface XmlTemplate {
  name: string;
  mapped: string;
  coverage: number;
}

export interface PolicySettings {
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
  updatedAt: string;
}

export interface AuditChange {
  field: string;
  before: string;
  after: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  changes: AuditChange[];
  restorePointId?: string;
}

export interface OpsSnapshot {
  id: string;
  createdAt: string;
  actor: string;
  reason: string;
  refunds: RefundCase[];
  payouts: PayoutRequest[];
  rules: AutomationRule[];
  automationLogs: AutomationLog[];
  moduleSubmissions: ModuleSubmission[];
  xmlFeeds: XmlFeed[];
  xmlTemplates: XmlTemplate[];
  policySettings: PolicySettings;
}

export interface RestorePoint {
  id: string;
  createdAt: string;
  label: string;
  actor: string;
  counts: {
    refunds: number;
    payouts: number;
    rules: number;
    logs: number;
    modules: number;
    feeds: number;
    templates: number;
    policies: number;
  };
}

interface AdminOpsState {
  refunds: RefundCase[];
  payouts: PayoutRequest[];
  rules: AutomationRule[];
  automationLogs: AutomationLog[];
  moduleSubmissions: ModuleSubmission[];
  xmlFeeds: XmlFeed[];
  xmlTemplates: XmlTemplate[];
  policySettings: PolicySettings;
  auditTrail: AuditEntry[];
  history: OpsSnapshot[];
  restorePoints: RestorePoint[];
  updateRefundStatus: (id: string, status: RefundStatus, actor: string) => void;
  updatePayoutStatus: (id: string, status: PayoutStatus, actor: string) => void;
  retryPayout: (id: string, actor: string) => void;
  createRule: (rule: AutomationRule, actor: string) => void;
  toggleRule: (id: string, actor: string) => void;
  deleteRule: (id: string, actor: string) => void;
  simulateRule: (id: string, result: "success" | "skipped" | "failed", actor: string) => void;
  setModuleStage: (id: string, stage: ModuleStage, actor: string) => void;
  setModuleRisk: (id: string, risk: ModuleRisk, actor: string) => void;
  createReleaseBatch: (actor: string) => void;
  retryXmlFeed: (id: string, actor: string) => void;
  runFullXmlSync: (actor: string) => void;
  improveXmlTemplateCoverage: (name: string, actor: string) => void;
  savePolicySettings: (next: Omit<PolicySettings, "updatedAt">, actor: string) => void;
  undoLast: (actor: string) => void;
  restoreFromPoint: (restorePointId: string, actor: string) => void;
}

const initialRules: AutomationRule[] = [
  { id: "AUT-101", name: "High Value Refund Approval", trigger: "refund.amount > 100", action: "require manager approval", status: "active", runs: 112 },
  { id: "AUT-102", name: "Payout Exception Routing", trigger: "payout.retry >= 2", action: "move to exception queue", status: "active", runs: 67 },
  { id: "AUT-103", name: "SLA Escalation", trigger: "ticket.sla_remaining < 2h", action: "assign senior support", status: "paused", runs: 25 },
];

const initialLogs: AutomationLog[] = [
  { id: "RUN-4501", rule: "AUT-101", result: "success", at: "2026-03-06 09:12" },
  { id: "RUN-4502", rule: "AUT-102", result: "success", at: "2026-03-06 09:20" },
  { id: "RUN-4503", rule: "AUT-103", result: "skipped", at: "2026-03-06 09:27" },
];

const initialModules: ModuleSubmission[] = [
  { id: "MOD-901", name: "Smart Checkout Rules", type: "checkout", owner: "Nexus Labs", stage: "qa", risk: "medium" },
  { id: "MOD-900", name: "Theme Variant Switcher", type: "theme", owner: "PixelThemes", stage: "review", risk: "low" },
  { id: "MOD-899", name: "Invoice XML Pro", type: "integration", owner: "CoreBridge", stage: "release", risk: "high" },
];

const initialFeeds: XmlFeed[] = [
  { id: "XML-331", partner: "MegaStore", status: "healthy", latency: "42s", lastSync: "6 Mar 2026, 18:20", errors: 0, retries: 0 },
  { id: "XML-330", partner: "ShopNet", status: "degraded", latency: "3m 12s", lastSync: "6 Mar 2026, 18:01", errors: 7, retries: 1 },
  { id: "XML-329", partner: "TrendCart", status: "blocked", latency: "-", lastSync: "6 Mar 2026, 16:40", errors: 24, retries: 2 },
];

const initialTemplates: XmlTemplate[] = [
  { name: "Product Catalog v2", mapped: "43 fields", coverage: 91 },
  { name: "Inventory Delta Feed", mapped: "17 fields", coverage: 95 },
  { name: "Order Dispatch Feed", mapped: "22 fields", coverage: 88 },
];

const initialPolicySettings: PolicySettings = {
  coreCommission: "20",
  premiumCommission: "15",
  xmlCommission: "12",
  minPayout: "50.00",
  txFee: "0.50",
  payoutRetry: "2",
  refundAutoCap: "20",
  reviewScoreThreshold: "72",
  require2fa: true,
  xmlStrictMode: true,
  autoNoindexDrafts: true,
  updatedAt: nowIso(),
};

const deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;

function nowIso() {
  return new Date().toISOString();
}

function nowDisplay() {
  return new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).replace(",", "");
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function makeAuditEntry(input: Omit<AuditEntry, "id" | "at">): AuditEntry {
  return {
    id: makeId("AUD"),
    at: nowIso(),
    ...input,
  };
}

function makeSnapshot(state: AdminOpsState, actor: string, reason: string) {
  const snapshotId = makeId("RST");
  const snapshot: OpsSnapshot = {
    id: snapshotId,
    createdAt: nowIso(),
    actor,
    reason,
    refunds: deepClone(state.refunds),
    payouts: deepClone(state.payouts),
    rules: deepClone(state.rules),
    automationLogs: deepClone(state.automationLogs),
    moduleSubmissions: deepClone(state.moduleSubmissions),
    xmlFeeds: deepClone(state.xmlFeeds),
    xmlTemplates: deepClone(state.xmlTemplates),
    policySettings: deepClone(state.policySettings),
  };

  const restorePoint: RestorePoint = {
    id: snapshotId,
    createdAt: snapshot.createdAt,
    label: reason,
    actor,
    counts: {
      refunds: snapshot.refunds.length,
      payouts: snapshot.payouts.length,
      rules: snapshot.rules.length,
      logs: snapshot.automationLogs.length,
      modules: snapshot.moduleSubmissions.length,
      feeds: snapshot.xmlFeeds.length,
      templates: snapshot.xmlTemplates.length,
      policies: 1,
    },
  };

  return { snapshot, restorePoint };
}

function withHistory(state: AdminOpsState, snapshot: OpsSnapshot, restorePoint: RestorePoint, audit: AuditEntry) {
  return {
    history: [snapshot, ...state.history].slice(0, 40),
    restorePoints: [restorePoint, ...state.restorePoints].slice(0, 40),
    auditTrail: [audit, ...state.auditTrail].slice(0, 500),
  };
}

export const useAdminOpsStore = create<AdminOpsState>()(
  persist(
    (set) => ({
      refunds: deepClone(refundCases),
      payouts: deepClone(payoutRequests),
      rules: deepClone(initialRules),
      automationLogs: deepClone(initialLogs),
      moduleSubmissions: deepClone(initialModules),
      xmlFeeds: deepClone(initialFeeds),
      xmlTemplates: deepClone(initialTemplates),
      policySettings: deepClone(initialPolicySettings),
      auditTrail: [
        makeAuditEntry({
          actor: "System",
          action: "system.bootstrap",
          target: "admin-ops",
          details: "Admin operations state initialized.",
          changes: [],
        }),
      ],
      history: [],
      restorePoints: [],

      updateRefundStatus: (id, status, actor) => {
        set((state) => {
          const current = state.refunds.find((item) => item.id === id);
          if (!current || current.status === status) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Refund update ${id}`);
          const refunds = state.refunds.map((item) => (item.id === id ? { ...item, status } : item));
          const audit = makeAuditEntry({
            actor,
            action: "refund.status.updated",
            target: id,
            details: `Refund ${id} status changed from ${current.status} to ${status}.`,
            changes: [{ field: "status", before: current.status, after: status }],
            restorePointId: snapshot.id,
          });

          return { refunds, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      updatePayoutStatus: (id, status, actor) => {
        set((state) => {
          const current = state.payouts.find((item) => item.id === id);
          if (!current || current.status === status) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Payout update ${id}`);
          const payouts = state.payouts.map((item) => (item.id === id ? { ...item, status } : item));
          const audit = makeAuditEntry({
            actor,
            action: "payout.status.updated",
            target: id,
            details: `Payout ${id} status changed from ${current.status} to ${status}.`,
            changes: [{ field: "status", before: current.status, after: status }],
            restorePointId: snapshot.id,
          });

          return { payouts, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      retryPayout: (id, actor) => {
        set((state) => {
          const current = state.payouts.find((item) => item.id === id);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Payout retry ${id}`);
          const payouts = state.payouts.map((item) => {
            if (item.id !== id) return item;
            return { ...item, retries: item.retries + 1, status: "İncelemede" as PayoutStatus, queue: "manual" as const };
          });

          const audit = makeAuditEntry({
            actor,
            action: "payout.retried",
            target: id,
            details: `Payout ${id} retried and moved to manual review.`,
            changes: [
              { field: "retries", before: String(current.retries), after: String(current.retries + 1) },
              { field: "status", before: current.status, after: "İncelemede" },
              { field: "queue", before: current.queue, after: "manual" },
            ],
            restorePointId: snapshot.id,
          });

          return { payouts, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      createRule: (rule, actor) => {
        set((state) => {
          if (state.rules.some((item) => item.id === rule.id)) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Rule create ${rule.id}`);
          const rules = [rule, ...state.rules];
          const audit = makeAuditEntry({
            actor,
            action: "automation.rule.created",
            target: rule.id,
            details: `Automation rule ${rule.name} created.`,
            changes: [{ field: "rule", before: "none", after: `${rule.trigger} -> ${rule.action}` }],
            restorePointId: snapshot.id,
          });

          return { rules, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      toggleRule: (id, actor) => {
        set((state) => {
          const current = state.rules.find((item) => item.id === id);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Rule toggle ${id}`);
          const nextStatus: AutomationRule["status"] = current.status === "active" ? "paused" : "active";
          const rules: AutomationRule[] = state.rules.map((item) => (item.id === id ? { ...item, status: nextStatus } : item));
          const audit = makeAuditEntry({
            actor,
            action: "automation.rule.toggled",
            target: id,
            details: `Rule ${id} status changed from ${current.status} to ${nextStatus}.`,
            changes: [{ field: "status", before: current.status, after: nextStatus }],
            restorePointId: snapshot.id,
          });

          return { rules, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      deleteRule: (id, actor) => {
        set((state) => {
          const current = state.rules.find((item) => item.id === id);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Rule delete ${id}`);
          const rules = state.rules.filter((item) => item.id !== id);
          const audit = makeAuditEntry({
            actor,
            action: "automation.rule.deleted",
            target: id,
            details: `Rule ${id} removed.`,
            changes: [{ field: "rule", before: `${current.trigger} -> ${current.action}`, after: "deleted" }],
            restorePointId: snapshot.id,
          });

          return { rules, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      simulateRule: (id, result, actor) => {
        set((state) => {
          const current = state.rules.find((item) => item.id === id);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Rule simulation ${id}`);
          const rules = state.rules.map((item) => (item.id === id ? { ...item, runs: item.runs + 1 } : item));
          const log: AutomationLog = {
            id: makeId("RUN"),
            rule: id,
            result,
            at: new Date().toLocaleString("sv-SE", { hour12: false }).replace("T", " "),
          };
          const automationLogs = [log, ...state.automationLogs].slice(0, 240);
          const audit = makeAuditEntry({
            actor,
            action: "automation.rule.simulated",
            target: id,
            details: `Simulation for ${id} completed with result ${result}.`,
            changes: [
              { field: "runs", before: String(current.runs), after: String(current.runs + 1) },
              { field: "simulation", before: "none", after: result },
            ],
            restorePointId: snapshot.id,
          });

          return { rules, automationLogs, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      setModuleStage: (id, stage, actor) => {
        set((state) => {
          const current = state.moduleSubmissions.find((item) => item.id === id);
          if (!current || current.stage === stage) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Module stage ${id}`);
          const moduleSubmissions = state.moduleSubmissions.map((item) => (item.id === id ? { ...item, stage } : item));
          const audit = makeAuditEntry({
            actor,
            action: "module.stage.updated",
            target: id,
            details: `Module ${id} moved from ${current.stage} to ${stage}.`,
            changes: [{ field: "stage", before: current.stage, after: stage }],
            restorePointId: snapshot.id,
          });

          return { moduleSubmissions, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      setModuleRisk: (id, risk, actor) => {
        set((state) => {
          const current = state.moduleSubmissions.find((item) => item.id === id);
          if (!current || current.risk === risk) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `Module risk ${id}`);
          const moduleSubmissions = state.moduleSubmissions.map((item) => (item.id === id ? { ...item, risk } : item));
          const audit = makeAuditEntry({
            actor,
            action: "module.risk.updated",
            target: id,
            details: `Module ${id} risk adjusted from ${current.risk} to ${risk}.`,
            changes: [{ field: "risk", before: current.risk, after: risk }],
            restorePointId: snapshot.id,
          });

          return { moduleSubmissions, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      createReleaseBatch: (actor) => {
        set((state) => {
          const releasable = state.moduleSubmissions.filter((item) => item.stage === "release");
          if (releasable.length === 0) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, "Modules release batch");
          const moduleSubmissions: ModuleSubmission[] = state.moduleSubmissions.map((item) =>
            item.stage === "release" ? { ...item, stage: "released", risk: "low" } : item
          );
          const audit = makeAuditEntry({
            actor,
            action: "module.release.batch.created",
            target: "release-batch",
            details: `${releasable.length} modules moved to released stage.`,
            changes: [{ field: "releasedModules", before: "0", after: String(releasable.length) }],
            restorePointId: snapshot.id,
          });

          return { moduleSubmissions, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      retryXmlFeed: (id, actor) => {
        set((state) => {
          const current = state.xmlFeeds.find((item) => item.id === id);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `XML retry ${id}`);
          const xmlFeeds = state.xmlFeeds.map((item) => {
            if (item.id !== id) return item;
            return {
              ...item,
              retries: item.retries + 1,
              status: "degraded" as XmlFeedStatus,
              errors: Math.max(0, item.errors - 2),
              lastSync: nowDisplay(),
              latency: item.status === "blocked" ? "2m 10s" : item.latency,
            };
          });

          const audit = makeAuditEntry({
            actor,
            action: "xml.feed.retried",
            target: id,
            details: `XML feed ${id} retry executed.`,
            changes: [
              { field: "retries", before: String(current.retries), after: String(current.retries + 1) },
              { field: "errors", before: String(current.errors), after: String(Math.max(0, current.errors - 2)) },
            ],
            restorePointId: snapshot.id,
          });

          return { xmlFeeds, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      runFullXmlSync: (actor) => {
        set((state) => {
          const { snapshot, restorePoint } = makeSnapshot(state, actor, "XML full sync");
          const xmlFeeds = state.xmlFeeds.map((feed) => {
            const nextErrors = Math.max(0, feed.errors - (feed.status === "blocked" ? 3 : 1));
            const nextStatus: XmlFeedStatus = nextErrors === 0 ? "healthy" : nextErrors > 15 ? "blocked" : "degraded";
            return {
              ...feed,
              errors: nextErrors,
              status: nextStatus,
              lastSync: nowDisplay(),
              latency: nextStatus === "healthy" ? "45s" : nextStatus === "degraded" ? "1m 35s" : "-",
            };
          });

          const beforeErrors = state.xmlFeeds.reduce((sum, feed) => sum + feed.errors, 0);
          const afterErrors = xmlFeeds.reduce((sum, feed) => sum + feed.errors, 0);
          const audit = makeAuditEntry({
            actor,
            action: "xml.sync.full_run",
            target: "xml-all",
            details: "Full XML sync completed for all partner feeds.",
            changes: [{ field: "errorsTotal", before: String(beforeErrors), after: String(afterErrors) }],
            restorePointId: snapshot.id,
          });

          return { xmlFeeds, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      improveXmlTemplateCoverage: (name, actor) => {
        set((state) => {
          const current = state.xmlTemplates.find((item) => item.name === name);
          if (!current) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, `XML template optimize ${name}`);
          const nextCoverage = Math.min(100, current.coverage + 1);
          const xmlTemplates = state.xmlTemplates.map((item) => (item.name === name ? { ...item, coverage: nextCoverage } : item));
          const audit = makeAuditEntry({
            actor,
            action: "xml.template.coverage.improved",
            target: name,
            details: `Template ${name} coverage improved to ${nextCoverage}%.`,
            changes: [{ field: "coverage", before: `${current.coverage}%`, after: `${nextCoverage}%` }],
            restorePointId: snapshot.id,
          });

          return { xmlTemplates, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      savePolicySettings: (next, actor) => {
        set((state) => {
          const previous = state.policySettings;
          const updated: PolicySettings = { ...next, updatedAt: nowIso() };
          const changedFields = Object.entries(next).filter(([key, value]) => previous[key as keyof Omit<PolicySettings, "updatedAt">] !== value);
          if (changedFields.length === 0) return state;

          const { snapshot, restorePoint } = makeSnapshot(state, actor, "Policy settings saved");
          const changes: AuditChange[] = changedFields.map(([field, value]) => ({
            field,
            before: String(previous[field as keyof Omit<PolicySettings, "updatedAt">]),
            after: String(value),
          }));

          const audit = makeAuditEntry({
            actor,
            action: "settings.policy.saved",
            target: "policy-settings",
            details: `Policy settings updated (${changedFields.length} fields).`,
            changes,
            restorePointId: snapshot.id,
          });

          return { policySettings: updated, ...withHistory(state, snapshot, restorePoint, audit) };
        });
      },

      undoLast: (actor) => {
        set((state) => {
          const latest = state.history[0];
          if (!latest) return state;

          const audit = makeAuditEntry({
            actor,
            action: "history.undo",
            target: latest.id,
            details: `Undo applied from snapshot ${latest.id}.`,
            changes: [
              { field: "refunds", before: String(state.refunds.length), after: String(latest.refunds.length) },
              { field: "payouts", before: String(state.payouts.length), after: String(latest.payouts.length) },
              { field: "rules", before: String(state.rules.length), after: String(latest.rules.length) },
              { field: "logs", before: String(state.automationLogs.length), after: String(latest.automationLogs.length) },
              { field: "modules", before: String(state.moduleSubmissions.length), after: String(latest.moduleSubmissions.length) },
              { field: "feeds", before: String(state.xmlFeeds.length), after: String(latest.xmlFeeds.length) },
              { field: "templates", before: String(state.xmlTemplates.length), after: String(latest.xmlTemplates.length) },
              { field: "policyUpdatedAt", before: state.policySettings.updatedAt, after: latest.policySettings.updatedAt },
            ],
            restorePointId: latest.id,
          });

          return {
            refunds: deepClone(latest.refunds),
            payouts: deepClone(latest.payouts),
            rules: deepClone(latest.rules),
            automationLogs: deepClone(latest.automationLogs),
            moduleSubmissions: deepClone(latest.moduleSubmissions),
            xmlFeeds: deepClone(latest.xmlFeeds),
            xmlTemplates: deepClone(latest.xmlTemplates),
            policySettings: deepClone(latest.policySettings),
            history: state.history.slice(1),
            auditTrail: [audit, ...state.auditTrail].slice(0, 500),
          };
        });
      },

      restoreFromPoint: (restorePointId, actor) => {
        set((state) => {
          const snapshot = state.history.find((item) => item.id === restorePointId);
          if (!snapshot) return state;

          const audit = makeAuditEntry({
            actor,
            action: "history.restore_point.applied",
            target: restorePointId,
            details: `Restore point ${restorePointId} applied.`,
            changes: [
              { field: "refunds", before: String(state.refunds.length), after: String(snapshot.refunds.length) },
              { field: "payouts", before: String(state.payouts.length), after: String(snapshot.payouts.length) },
              { field: "rules", before: String(state.rules.length), after: String(snapshot.rules.length) },
              { field: "logs", before: String(state.automationLogs.length), after: String(snapshot.automationLogs.length) },
              { field: "modules", before: String(state.moduleSubmissions.length), after: String(snapshot.moduleSubmissions.length) },
              { field: "feeds", before: String(state.xmlFeeds.length), after: String(snapshot.xmlFeeds.length) },
              { field: "templates", before: String(state.xmlTemplates.length), after: String(snapshot.xmlTemplates.length) },
              { field: "policyUpdatedAt", before: state.policySettings.updatedAt, after: snapshot.policySettings.updatedAt },
            ],
            restorePointId,
          });

          return {
            refunds: deepClone(snapshot.refunds),
            payouts: deepClone(snapshot.payouts),
            rules: deepClone(snapshot.rules),
            automationLogs: deepClone(snapshot.automationLogs),
            moduleSubmissions: deepClone(snapshot.moduleSubmissions),
            xmlFeeds: deepClone(snapshot.xmlFeeds),
            xmlTemplates: deepClone(snapshot.xmlTemplates),
            policySettings: deepClone(snapshot.policySettings),
            auditTrail: [audit, ...state.auditTrail].slice(0, 500),
          };
        });
      },
    }),
    {
      name: "admin-ops-storage",
      partialize: (state) => ({
        refunds: state.refunds,
        payouts: state.payouts,
        rules: state.rules,
        automationLogs: state.automationLogs,
        moduleSubmissions: state.moduleSubmissions,
        xmlFeeds: state.xmlFeeds,
        xmlTemplates: state.xmlTemplates,
        policySettings: state.policySettings,
        auditTrail: state.auditTrail,
        history: state.history,
        restorePoints: state.restorePoints,
      }),
    }
  )
);
