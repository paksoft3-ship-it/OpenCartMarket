"use client";

import { createContext, useContext } from "react";

export type AdminView = "super" | "ops" | "finance" | "content" | "growth";

type AdminAction =
  | "approve_refund"
  | "approve_payout"
  | "run_settlement"
  | "send_support_reply"
  | "simulate_automation"
  | "edit_automation"
  | "run_risk_scan"
  | "mark_risk_reviewed"
  | "create_automation"
  | "manage_modules"
  | "manage_xml";

const actionPermissions: Record<AdminAction, AdminView[]> = {
  approve_refund: ["super", "ops", "finance"],
  approve_payout: ["super", "finance"],
  run_settlement: ["super", "finance"],
  send_support_reply: ["super", "ops"],
  simulate_automation: ["super", "ops", "finance", "content", "growth"],
  edit_automation: ["super", "ops", "finance"],
  run_risk_scan: ["super", "ops", "finance"],
  mark_risk_reviewed: ["super", "ops", "finance"],
  create_automation: ["super", "ops", "finance", "content", "growth"],
  manage_modules: ["super", "ops", "content"],
  manage_xml: ["super", "ops", "finance"],
};

const AdminAccessContext = createContext<AdminView>("super");

export function AdminAccessProvider({ activeView, children }: { activeView: AdminView; children: React.ReactNode }) {
  return <AdminAccessContext.Provider value={activeView}>{children}</AdminAccessContext.Provider>;
}

export function useAdminView() {
  return useContext(AdminAccessContext);
}

export function useCan(action: AdminAction) {
  const view = useAdminView();
  return actionPermissions[action].includes(view);
}
