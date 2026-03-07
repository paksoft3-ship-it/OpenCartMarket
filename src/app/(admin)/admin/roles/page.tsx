"use client";

import { useState } from "react";

const roles = [
  { id: "role-ops", name: "Operations Manager", users: 4, scope: "Orders, Refunds, Support", perms: ["approve_refund", "assign_ticket", "review_risk"] },
  { id: "role-fin", name: "Finance Analyst", users: 3, scope: "Payouts, Revenue, Reconciliation", perms: ["approve_payout", "view_revenue", "run_settlement"] },
  { id: "role-content", name: "Content Lead", users: 2, scope: "Blog, SEO, Docs", perms: ["publish_blog", "manage_seo", "edit_docs"] },
  { id: "role-growth", name: "Growth Manager", users: 2, scope: "Marketing, Analytics", perms: ["launch_campaign", "manage_coupon", "view_cohorts"] },
];

const views = [
  { name: "Ops View", modules: "Orders, Refunds, Support, Risk", widgets: "SLA, Escalations, Pending queue" },
  { name: "Finance View", modules: "Payouts, Analytics, Risk", widgets: "Settlement, Exceptions, Fees" },
  { name: "Content View", modules: "Blog, SEO", widgets: "Editorial queue, SEO issues" },
  { name: "Growth View", modules: "Marketing, Analytics", widgets: "ROAS, cohorts, campaigns" },
];

export default function AdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const role = roles.find((item) => item.id === selectedRole) ?? roles[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Roles and Views</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Role-based erisim kontrolu ve panel gorunumleri.</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Create Role</button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Scope</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((item) => (
                <tr key={item.id} className="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50" onClick={() => setSelectedRole(item.id)}>
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.users}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{role.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{role.scope}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {role.perms.map((perm) => (
                <span key={perm} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{perm}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Default Views</h3>
            <div className="mt-3 space-y-2">
              {views.map((view) => (
                <div key={view.name} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{view.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{view.modules}</p>
                  <p className="mt-1 text-xs text-slate-500">{view.widgets}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
