"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ModuleSubmission {
  id: string;
  name: string;
  type: string;
  owner: string;
  stage: string;
  risk: string;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [queue, setQueue] = useState<ModuleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/modules")
      .then((r) => r.json())
      .then((data) => {
        const items: ModuleSubmission[] = data.items ?? [];
        setQueue(items);
        if (items.length > 0) setSelectedId(items[0].id);
      })
      .catch(() => toast.error("Failed to load moderation queue."))
      .finally(() => setLoading(false));
  }, []);

  const selected = queue.find((item) => item.id === selectedId) ?? queue[0] ?? null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Moderation Queue</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and approve module submissions before they go live.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input placeholder="Search submissions..." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          Loading...
        </div>
      ) : queue.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
          No submissions pending review.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3">Submission</th>
                  <th className="px-4 py-3">Developer</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.owner}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{item.type}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        item.stage === "review" ? "bg-amber-100 text-amber-700" :
                        item.stage === "released" ? "bg-emerald-100 text-emerald-700" :
                        item.stage === "blocked" ? "bg-red-100 text-red-700" :
                        "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}>{item.stage}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => setSelectedId(item.id)} className="font-semibold text-primary hover:underline">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {selected ? (
              <>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.id} • {selected.owner}</p>
                <div className="mt-2 flex gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                    selected.risk === "high" ? "bg-red-100 text-red-700" :
                    selected.risk === "medium" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>Risk: {selected.risk}</span>
                </div>
                <div className="mt-4 rounded-lg border border-slate-100 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  Review the product package, documentation and screenshots. Approve if it passes compliance, performance and quality criteria.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Reject</button>
                  <button className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20">Request Revision</button>
                  <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Approve</button>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Select a submission to review.</p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
