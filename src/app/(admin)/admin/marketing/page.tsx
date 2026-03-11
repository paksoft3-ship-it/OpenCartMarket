"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  roas: string | null;
  status: "active" | "paused" | "ended";
}

export default function AdminMarketingPage() {
  const tr = useAdminLanguage() === "tr";
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "", budget: "", status: "active" as "active" | "paused" });

  const load = async () => {
    try {
      const res = await fetch("/api/admin/marketing");
      if (res.ok) {
        const { items } = await res.json();
        setCampaigns(items ?? []);
      }
    } catch {
      toast.error(tr ? "Kampanyalar yüklenemedi." : "Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.channel.trim()) {
      toast.error(tr ? "Kampanya adı ve kanal zorunludur." : "Campaign name and channel are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ name: form.name, channel: form.channel, budget: Number(form.budget) || 0, status: form.status }),
      });
      if (!res.ok) throw new Error();
      const created: Campaign = await res.json();
      setCampaigns((prev) => [created, ...prev]);
      setShowModal(false);
      setForm({ name: "", channel: "", budget: "", status: "active" });
      toast.success(tr ? "Kampanya oluşturuldu." : "Campaign created.");
    } catch {
      toast.error(tr ? "Kampanya oluşturulamadı." : "Failed to create campaign.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/admin/marketing/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-actor": "Admin" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const updated: Campaign = await res.json();
      setCampaigns((prev) => prev.map((c) => c.id === campaign.id ? updated : c));
      toast.success(tr ? "Durum güncellendi." : "Status updated.");
    } catch {
      toast.error(tr ? "Güncelleme başarısız." : "Update failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(tr ? "Bu kampanya silinsin mi?" : "Delete this campaign?")) return;
    try {
      const res = await fetch(`/api/admin/marketing/${id}`, { method: "DELETE", headers: { "x-admin-actor": "Admin" } });
      if (!res.ok) throw new Error();
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success(tr ? "Kampanya silindi." : "Campaign deleted.");
    } catch {
      toast.error(tr ? "Silinemedi." : "Delete failed.");
    }
  };

  const active = campaigns.filter((c) => c.status === "active").length;
  const paused = campaigns.filter((c) => c.status === "paused").length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Pazarlama Merkezi" : "Marketing Hub"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Kampanyaları yönetin ve takip edin." : "Manage and track campaigns."}</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" onClick={() => setShowModal(true)}>
          {tr ? "Kampanya Oluştur" : "Create Campaign"}
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric label={tr ? "Toplam Kampanya" : "Total Campaigns"} value={campaigns.length.toString()} loading={loading} />
        <Metric label={tr ? "Aktif" : "Active"} value={active.toString()} loading={loading} />
        <Metric label={tr ? "Duraklatıldı" : "Paused"} value={paused.toString()} loading={loading} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{tr ? "Kampanya Panosu" : "Campaign Board"}</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-10 text-slate-500">{tr ? "Yükleniyor..." : "Loading..."}</div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-slate-500 gap-2">
            <p>{tr ? "Henüz kampanya yok." : "No campaigns yet."}</p>
            <button className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" onClick={() => setShowModal(true)}>
              {tr ? "İlk Kampanyayı Oluştur" : "Create First Campaign"}
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">{tr ? "Kampanya" : "Campaign"}</th>
                <th className="px-4 py-3">{tr ? "Kanal" : "Channel"}</th>
                <th className="px-4 py-3">{tr ? "Bütçe" : "Budget"}</th>
                <th className="px-4 py-3">{tr ? "Durum" : "Status"}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{campaign.name}</p>
                    <p className="text-xs text-slate-500">{campaign.id}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{campaign.channel}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">${Number(campaign.budget).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${campaign.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      onClick={() => toggleStatus(campaign)}
                    >
                      {tr ? (campaign.status === "active" ? "aktif" : "duraklatıldı") : campaign.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => handleDelete(campaign.id)}>
                      {tr ? "Sil" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Campaign Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{tr ? "Yeni Kampanya" : "New Campaign"}</h2>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Kampanya adı *" : "Campaign name *"}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Kanal (Email, Meta Ads...)" : "Channel (Email, Meta Ads...)"}
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}
                required
              />
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                placeholder={tr ? "Bütçe ($)" : "Budget ($)"}
                type="number"
                min="0"
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
              />
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "active" | "paused" }))}
              >
                <option value="active">{tr ? "Aktif" : "Active"}</option>
                <option value="paused">{tr ? "Duraklatıldı" : "Paused"}</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700" onClick={() => setShowModal(false)}>
                  {tr ? "İptal" : "Cancel"}
                </button>
                <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50">
                  {saving ? (tr ? "Kaydediliyor..." : "Saving...") : (tr ? "Kaydet" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, loading }: { label: string; value: string; loading: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{loading ? "—" : value}</p>
    </div>
  );
}
