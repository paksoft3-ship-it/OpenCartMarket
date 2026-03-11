"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";
import { toast } from "sonner";

interface PayoutRequest {
  id: string;
  developer: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface Product {
  id: string;
  categoryId: string;
}

export default function AdminAnalyticsPage() {
  const tr = useAdminLanguage() === "tr";
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/payouts").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/admin/products").then((r) => r.json()).catch(() => ({ items: [] })),
    ]).then(([p, pr]) => {
      setPayouts(p.items ?? []);
      setProducts(pr.items ?? []);
    }).catch(() => {
      toast.error(tr ? "Veriler yüklenemedi." : "Failed to load data.");
    }).finally(() => setLoading(false));
  }, [tr]);

  const recentPayouts = useMemo(() => payouts.slice(0, 5), [payouts]);

  const topDevelopers = useMemo(() => {
    const map = new Map<string, { name: string; count: number; total: number }>();
    for (const p of payouts) {
      const existing = map.get(p.developer);
      if (existing) {
        existing.count += 1;
        existing.total += p.amount;
      } else {
        map.set(p.developer, { name: p.developer, count: 1, total: p.amount });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [payouts]);

  const categorySplit = useMemo(() => {
    const total = products.length;
    if (total === 0) return [];
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, count]) => ({ cat, percent: Math.round((count / total) * 100) }));
  }, [products]);

  const totalPayoutAmount = useMemo(() => payouts.reduce((sum, p) => sum + p.amount, 0), [payouts]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Satış Analitiği" : "Sales Analytics"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Pazaryeri performans metrikleri ve ödeme hareketleri." : "Marketplace performance metrics and payout activity."}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={tr ? "Toplam Ürün" : "Total Products"} value={loading ? "—" : products.length.toLocaleString()} />
        <MetricCard label={tr ? "Toplam Ödeme" : "Total Payouts"} value={loading ? "—" : payouts.length.toLocaleString()} />
        <MetricCard label={tr ? "Toplam Ödeme Tutarı" : "Total Payout Amount"} value={loading ? "—" : `$${totalPayoutAmount.toLocaleString()}`} />
        <MetricCard label={tr ? "Kategori Sayısı" : "Categories"} value={loading ? "—" : categorySplit.length.toString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "En Yüksek Ödeme Alan Geliştiriciler" : "Top Developers by Payouts"}</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
          ) : topDevelopers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">{tr ? "Henüz ödeme verisi yok." : "No payout data yet."}</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
                  <th className="px-4 py-3">{tr ? "Ödeme Sayısı" : "Payouts"}</th>
                  <th className="px-4 py-3">{tr ? "Toplam" : "Total"}</th>
                </tr>
              </thead>
              <tbody>
                {topDevelopers.map((developer) => (
                  <tr key={developer.name} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">{developer.name}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{developer.count}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">${developer.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-4 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Son Ödemeler" : "Recent Payouts"}</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
          ) : recentPayouts.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">{tr ? "Henüz ödeme yok." : "No payouts yet."}</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">{tr ? "Geliştirici" : "Developer"}</th>
                  <th className="px-4 py-3">{tr ? "Tutar" : "Amount"}</th>
                  <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {recentPayouts.map((payout) => (
                  <tr key={payout.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{payout.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{payout.developer}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100">${payout.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary capitalize">{payout.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      {!loading && categorySplit.length > 0 && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{tr ? "Kategori Dağılımı" : "Category Split"}</h2>
          <div className="space-y-3 text-sm">
            {categorySplit.map(({ cat, percent }) => (
              <div key={cat} className="flex items-center justify-between border-b border-slate-100 pb-2 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                <span className="font-semibold">{percent}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
