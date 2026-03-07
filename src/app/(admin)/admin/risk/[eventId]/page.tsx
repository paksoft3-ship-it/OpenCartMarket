"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { buildRiskEvents, getRiskEventById } from "@/lib/data/adminOps";
import { useMockData } from "@/lib/hooks/useMockData";
import { useCan } from "@/components/admin/AdminAccessContext";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";

export default function RiskEventDetailPage() {
  const params = useParams<{ eventId: string }>();
  const { orders, isLoaded } = useMockData();
  const refunds = useAdminOpsStore((state) => state.refunds);
  const payouts = useAdminOpsStore((state) => state.payouts);
  const canMarkReviewed = useCan("mark_risk_reviewed");
  const canCreateAutomation = useCan("create_automation");

  const events = useMemo(() => buildRiskEvents(orders, refunds, payouts), [orders, payouts, refunds]);
  const event = useMemo(() => getRiskEventById(events, params.eventId), [events, params.eventId]);

  if (!isLoaded) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;

  if (!event) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Risk Event Not Found</h1>
          <Link className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white" href="/admin/risk">
            Back to Risk Center
          </Link>
        </div>
      </div>
    );
  }

  const sourceHref =
    event.source === "order"
      ? `/admin/orders?orderId=${event.ref}`
      : event.source === "refund"
      ? `/admin/refunds?refundId=${event.ref}`
      : `/admin/payouts?payoutId=${event.ref}`;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Risk Event</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{event.id}</h1>
          <p className="mt-1 text-sm text-slate-500">{event.source} • {event.ref} • {event.age}</p>
          <Link className="mt-2 inline-flex text-sm font-semibold text-primary hover:underline" href={sourceHref}>
            Open Source Case
          </Link>
        </div>
        <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" href="/admin/risk">
          Back
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Event Summary</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Mini label="Source" value={event.source} />
            <Mini label="Reference" value={event.ref} />
            <Mini label="Severity" value={event.severity} />
            <Mini label="Risk Score" value={String(event.score)} />
          </div>
          <div className="mt-4 rounded-lg border border-slate-100 p-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
            {event.reason}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recommended Actions</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Assign senior reviewer.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Require manual verification step.</li>
              <li className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">Add case note and follow-up reminder.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Workflow</h3>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Escalate</button>
              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800" disabled={!canMarkReviewed}>
                Mark as Reviewed
              </button>
              <button className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!canCreateAutomation}>
                Create Automation
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900 capitalize dark:text-slate-100">{value}</p>
    </div>
  );
}
