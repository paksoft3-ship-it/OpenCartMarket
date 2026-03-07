"use client";

import { useState } from "react";

const queue = [
  { id: "SUB-1042", name: "Modern Theme", type: "theme", dev: "Pixel Perfect", date: "2026-03-06", status: "pending" },
  { id: "SUB-1039", name: "Advanced SEO", type: "module", dev: "WebBoost", date: "2026-03-05", status: "pending" },
  { id: "SUB-1034", name: "Quick Cart", type: "module", dev: "SmartLabs", date: "2026-03-04", status: "pending" },
];

export default function AdminReviewsPage() {
  const [selectedId, setSelectedId] = useState(queue[0].id);
  const selected = queue.find((item) => item.id === selectedId) ?? queue[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Moderation Queue</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">admin_moderation_queue_review_drawer tasarımına göre güncellendi.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input placeholder="Search submissions..." className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900" />
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900">Pending</button>
          <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium dark:border-slate-700 dark:bg-slate-900">High Risk</button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
              <tr>
                <th className="px-4 py-3">Submission</th>
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.dev}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{item.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-500">{item.date}</td>
                  <td className="px-4 py-3 text-sm">
                    <button onClick={() => setSelectedId(item.id)} className="font-semibold text-primary hover:underline">İncele</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selected.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{selected.id} • {selected.dev}</p>
          <div className="mt-4 rounded-lg border border-slate-100 p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
            Ürün paketini, dokümantasyonu ve ekran görüntülerini kontrol edin. Uyum, performans ve kalite kriterlerini geçerse onaylayın.
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Reddet</button>
            <button className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20">Revizyon İste</button>
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Onayla</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
