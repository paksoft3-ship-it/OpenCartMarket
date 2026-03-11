"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

interface AuditEntry { id: string; action: string; details: string; actor: string; at: string; }
interface ModuleItem { id: string; name: string; owner: string; stage: string; }
interface AutomationRule { id: string; status: string; }
interface ProductItem { id: string; categoryId: string; }

export default function AdminDashboardOverview() {
  const tr = useAdminLanguage() === "tr";

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/admin/modules").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/admin/audit").then((r) => r.json()).catch(() => ({ items: [] })),
      fetch("/api/admin/automations").then((r) => r.json()).catch(() => ({ items: [] })),
    ]).then(([p, m, a, au]) => {
      setProducts(p.items ?? []);
      setModules(m.items ?? []);
      setAuditTrail(a.items ?? []);
      setAutomations(au.items ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const recentActivity = useMemo(() => auditTrail.slice(0, 4), [auditTrail]);
  const pendingModules = useMemo(() => modules.filter((m) => m.stage === "review").slice(0, 3), [modules]);
  const activeAutomations = useMemo(() => automations.filter((a) => a.status === "active").length, [automations]);

  const portfolioMix = useMemo(() => [
    { label: tr ? "Temalar" : "Themes", icon: "palette", key: "themes" },
    { label: tr ? "Modüller" : "Modules", icon: "extension", key: "modules" },
    { label: tr ? "XML Entegrasyonları" : "XML Integrations", icon: "sync_alt", key: "xml-integrations" },
    { label: tr ? "Ödeme" : "Payment", icon: "payments", key: "payment" },
    { label: tr ? "Pazarlama" : "Marketing", icon: "campaign", key: "marketing" },
    { label: tr ? "SEO Paketleri" : "SEO Packs", icon: "travel_explore", key: "seo" },
  ].map((item) => ({
    ...item,
    count: products.filter((p) => p.categoryId === item.key).length,
  })), [products, tr]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-hide">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{tr ? "Genel Bakış" : "Overview"}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tr ? "Pazaryerinizde bugün olanların özeti." : "Here is what is happening with your marketplace today."}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          icon="inventory_2" color="bg-primary/10" iconColor="text-primary"
          label={tr ? "Toplam Ürün" : "Total Products"}
          value={loading ? "—" : products.length.toLocaleString()}
        />
        <KpiCard
          icon="deployed_code" color="bg-amber-500/10" iconColor="text-amber-600"
          label={tr ? "İnceleme Bekleyen" : "Pending Review"}
          value={loading ? "—" : pendingModules.length.toLocaleString()}
        />
        <KpiCard
          icon="bolt" color="bg-purple-500/10" iconColor="text-purple-600"
          label={tr ? "Aktif Otomasyon" : "Active Automations"}
          value={loading ? "—" : activeAutomations.toLocaleString()}
        />
        <KpiCard
          icon="history" color="bg-emerald-500/10" iconColor="text-emerald-600"
          label={tr ? "Denetim Kayıtları" : "Audit Entries"}
          value={loading ? "—" : auditTrail.length.toLocaleString()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Mix */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{tr ? "Pazaryeri Portföy Dağılımı" : "Marketplace Portfolio Mix"}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{tr ? "Kategoriye göre aktif ürün sayısı" : "Active products by category"}</p>
            </div>
            <Link href="/admin/products" className="text-sm font-semibold text-primary hover:underline">{tr ? "Kataloğu Yönet" : "Manage Catalog"}</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {portfolioMix.map((item) => (
              <div key={item.key} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                  <span className="material-symbols-outlined text-slate-500">{item.icon}</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{loading ? "—" : item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tr ? "İnceleme Bekleyen Modüller" : "Pending Module Reviews"}</h3>
              {pendingModules.length > 0 && (
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full">{pendingModules.length}</span>
              )}
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading && (
                <div className="p-4 text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
              )}
              {!loading && pendingModules.length === 0 && (
                <div className="p-4 text-sm text-slate-500">{tr ? "Bekleyen modül yok." : "No pending modules."}</div>
              )}
              {pendingModules.map((mod) => (
                <div key={mod.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">extension</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">{mod.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{mod.owner} • {mod.id}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Link href="/admin/modules" className="block w-full py-1.5 px-3 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition-colors text-center">
                      {tr ? "İncele" : "Review"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/modules" className="block p-3 text-center text-xs font-medium text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-t border-slate-200 dark:border-slate-800">
              {tr ? "Tüm Modülleri Gör" : "View All Modules"}
            </Link>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">{tr ? "Son Aktivite" : "Recent Activity"}</h3>
            <div className="space-y-3">
              {loading && <p className="text-sm text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</p>}
              {!loading && recentActivity.length === 0 && <p className="text-sm text-slate-500">{tr ? "Henüz aktivite yok." : "No activity yet."}</p>}
              {recentActivity.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">{entry.action}</p>
                  <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">{entry.details}</p>
                  <p className="mt-1 text-xs text-slate-500">{entry.actor} • {new Date(entry.at).toLocaleString(tr ? "tr-TR" : "en-US")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Growth Shortcuts */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">{tr ? "Büyüme Kısayolları" : "Growth Shortcuts"}</h3>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <QuickLink href="/admin/blog" label={tr ? "Blog Yönetimi" : "Blog Management"} icon="article" />
          <QuickLink href="/admin/marketing" label={tr ? "Kampanya Merkezi" : "Campaign Hub"} icon="campaign" />
          <QuickLink href="/admin/refunds" label={tr ? "İade Merkezi" : "Refund Hub"} icon="assignment_return" />
          <QuickLink href="/admin/payouts" label={tr ? "Ödeme Konsolu" : "Payout Console"} icon="payments" />
          <QuickLink href="/admin/modules" label={tr ? "Modül Laboratuvarı" : "Modules Lab"} icon="deployed_code" />
          <QuickLink href="/admin/xml" label={tr ? "XML Entegrasyon" : "XML Integration"} icon="sync_alt" />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon, color, iconColor, label, value }: { icon: string; color: string; iconColor: string; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 ${color} rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</h3>
    </div>
  );
}

function QuickLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {label}
      </span>
      <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
    </Link>
  );
}
