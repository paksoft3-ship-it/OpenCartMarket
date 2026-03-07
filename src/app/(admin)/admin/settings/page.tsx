"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAdminOpsStore } from "@/lib/store/adminOpsStore";
import { useAdminLanguage } from "@/components/admin/AdminLanguageContext";

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
  const language = useAdminLanguage();
  const tr = language === "tr";
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
    toast.success(tr ? "Ayarlar kaydedildi ve politika dağıtım kuyruğuna alındı." : "Settings saved and queued for policy deployment.");
  };

  const applyRestorePoint = (restorePointId: string | undefined) => {
    if (!restorePointId) return;
    if (!window.confirm(tr ? `${restorePointId} geri yükleme noktası uygulansın mı?` : `Apply restore point ${restorePointId}?`)) return;
    restoreFromPoint(restorePointId, "Admin");
    toast.success(tr ? "Politika geri yükleme noktası uygulandı." : "Policy restore point applied.");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{tr ? "Kontrol Düzlemi Ayarları" : "Control Plane Settings"}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tr ? "Yönetişim, finans, katalog kalitesi, XML entegrasyonları, SEO ve iletişim politikalarını yönetin." : "Configure governance, finance, catalog quality, XML integrations, SEO and communication policies."}</p>
          <p className="mt-2 text-xs text-slate-500">{tr ? "Son güncelleme" : "Last updated"}: {new Date(policySettings.updatedAt).toLocaleString(tr ? "tr-TR" : "en-US")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            disabled={!isDirty}
            onClick={resetDraft}
            type="button"
          >
            {tr ? "Taslağı Sıfırla" : "Reset Draft"}
          </button>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50" disabled={!isDirty} onClick={saveAll}>
            {tr ? "Tüm Politikaları Kaydet" : "Save All Policies"}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <QuickLink href="/admin/roles" label={tr ? "Roller ve Yetkiler" : "Roles and Permissions"} icon="admin_panel_settings" desc={tr ? "Politikaları ve rol şablonlarını görüntüle" : "View policies and role presets"} />
        <QuickLink href="/admin/modules" label={tr ? "Modül Yayın Laboratuvarı" : "Modules Release Lab"} icon="deployed_code" desc={tr ? "İnceleme ve yayın akışı" : "Review and release workflow"} />
        <QuickLink href="/admin/xml" label={tr ? "XML Entegrasyon Merkezi" : "XML Integration Hub"} icon="sync_alt" desc={tr ? "Eşleme şablonları ve besleme sağlığı" : "Mapping templates and feed health"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="space-y-6">
          <Panel title={tr ? "Komisyon Matrisi" : "Commission Matrix"}>
            <FieldRow label={tr ? "Temel Eklentiler (%)" : "Core Extensions (%)"} value={draft.coreCommission} onChange={(value) => setDraft((prev) => ({ ...prev, coreCommission: value }))} />
            <FieldRow label={tr ? "Premium Temalar (%)" : "Premium Themes (%)"} value={draft.premiumCommission} onChange={(value) => setDraft((prev) => ({ ...prev, premiumCommission: value }))} />
            <FieldRow label={tr ? "XML Entegrasyonları (%)" : "XML Integrations (%)"} value={draft.xmlCommission} onChange={(value) => setDraft((prev) => ({ ...prev, xmlCommission: value }))} />
          </Panel>

          <Panel title={tr ? "Ödeme ve İade Sınırları" : "Payout and Refund Guardrails"}>
            <FieldRow label={tr ? "Minimum ödeme ($)" : "Minimum payout ($)"} value={draft.minPayout} onChange={(value) => setDraft((prev) => ({ ...prev, minPayout: value }))} />
            <FieldRow label={tr ? "İşlem ücreti ($)" : "Transaction fee ($)"} value={draft.txFee} onChange={(value) => setDraft((prev) => ({ ...prev, txFee: value }))} />
            <FieldRow label={tr ? "Ödeme yeniden deneme limiti" : "Payout retry limit"} value={draft.payoutRetry} onChange={(value) => setDraft((prev) => ({ ...prev, payoutRetry: value }))} />
            <FieldRow label={tr ? "Otomatik iade üst limiti ($)" : "Auto-refund cap ($)"} value={draft.refundAutoCap} onChange={(value) => setDraft((prev) => ({ ...prev, refundAutoCap: value }))} />
          </Panel>

          <Panel title={tr ? "Katalog ve Moderasyon Politikası" : "Catalog and Moderation Policy"}>
            <FieldRow label={tr ? "Manuel inceleme için risk skoru eşiği" : "Risk score threshold for manual review"} value={draft.reviewScoreThreshold} onChange={(value) => setDraft((prev) => ({ ...prev, reviewScoreThreshold: value }))} />
            <ToggleRow
              checked={draft.require2fa}
              description={tr ? "Tüm admin rolleri kritik işlemler için 2FA kullanmalıdır." : "All admin roles must pass 2FA for sensitive actions."}
              label={tr ? "Admin işlemleri için zorunlu 2FA" : "Mandatory 2FA for admin actions"}
              onChange={(value) => setDraft((prev) => ({ ...prev, require2fa: value }))}
              tr={tr}
            />
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "İlk yayın için QA + güvenlik kontrolleri zorunludur." : "First release requires QA + security checks."}</p>
              <p className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">{tr ? "Reddedilen gönderimler geliştiriciye fark notlarıyla otomatik bildirilir." : "Rejected submissions auto-notify developer with diff notes."}</p>
            </div>
          </Panel>

          <Panel title={tr ? "XML Entegrasyon Kontrolleri" : "XML Integration Controls"}>
            <ToggleRow
              checked={draft.xmlStrictMode}
              description={tr ? "Bozuk beslemeleri reddet ve şema doğrulamayı zorunlu tut." : "Reject malformed feeds and force schema validation."}
              label={tr ? "Katı şema modu" : "Strict schema mode"}
              onChange={(value) => setDraft((prev) => ({ ...prev, xmlStrictMode: value }))}
              tr={tr}
            />
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <ActionButton label={tr ? "Eşlemeleri yeniden oluştur" : "Rebuild mappings"} onClick={() => toast.success(tr ? "Eşleme yeniden oluşturma işi kuyruğa alındı." : "Mapping rebuild job queued.")} />
              <ActionButton label={tr ? "Başarısız senkronları tekrar çalıştır" : "Re-run failed syncs"} onClick={() => {
                runFullXmlSync("Admin");
                toast.success(tr ? "Başarısız senkron tekrar çalıştırma kuyruğa alındı." : "Failed sync re-run queued.");
              }} />
              <ActionButton label={tr ? "Yeniden deneme kuyruğunu aç" : "Open retry queue"} onClick={() => toast.info(tr ? "Yeniden deneme kuyruğunu XML Merkezi üzerinden inceleyin." : "Use XML Hub to inspect retry queue.")}
              />
              <ActionButton label={tr ? "Besleme tanılama raporunu dışa aktar" : "Export feed diagnostics"} onClick={() => toast.success(tr ? "Tanılama dışa aktarma başlatıldı." : "Diagnostics export started.")} />
            </div>
          </Panel>
        </section>

        <aside className="space-y-6">
          <Panel title={tr ? "Politika Geçmişi" : "Policy History"}>
            <div className="mb-3 grid gap-2 md:grid-cols-2">
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                onChange={(event) => setHistoryQuery(event.target.value)}
                placeholder={tr ? "Aktör, alan veya değer ara..." : "Search actor, field, or value..."}
                value={historyQuery}
              />
              <div className="grid grid-cols-3 gap-2">
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryActor(event.target.value)}
                  value={historyActor}
                >
                  <option value="all">{tr ? "Tüm Aktörler" : "All Actors"}</option>
                  {historyActors.map((actor) => (
                    <option key={actor} value={actor}>{actor}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryField(event.target.value)}
                  value={historyField}
                >
                  <option value="all">{tr ? "Tüm Alanlar" : "All Fields"}</option>
                  {historyFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                <select
                  className="rounded-lg border border-slate-200 px-2 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  onChange={(event) => setHistoryWindow(event.target.value as "all" | "7d" | "30d")}
                  value={historyWindow}
                >
                  <option value="all">{tr ? "Tüm Zamanlar" : "All Time"}</option>
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
                      <p className="text-xs text-slate-500">{new Date(entry.at).toLocaleString(tr ? "tr-TR" : "en-US")} • {entry.actor}</p>
                    </div>
                    {entry.restorePointId && (
                      <button
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        onClick={() => applyRestorePoint(entry.restorePointId)}
                        type="button"
                      >
                        {tr ? "Geri Yükle" : "Restore"}
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {entry.changes.slice(0, 4).map((change, index) => (
                      <span key={`${change.field}-${index}`} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {change.field}: {change.before} → {change.after}
                      </span>
                    ))}
                    {entry.changes.length > 4 && <span className="text-[11px] text-slate-500">+{entry.changes.length - 4} {tr ? "daha" : "more"}</span>}
                  </div>
                </div>
              ))}
              {policyHistory.length === 0 && <p className="text-sm text-slate-500">{tr ? "Henüz kayıtlı politika revizyonu yok." : "No saved policy revisions yet."}</p>}
            </div>
          </Panel>

          <Panel title={tr ? "Büyüme ve SEO Varsayılanları" : "Growth and SEO Defaults"}>
            <ToggleRow
              checked={draft.autoNoindexDrafts}
              description={tr ? "Taslak veya planlı blog içeriklerine noindex uygula." : "Apply noindex to draft or scheduled blog content."}
              label={tr ? "Taslaklar için otomatik noindex" : "Auto noindex for drafts"}
              onChange={(value) => setDraft((prev) => ({ ...prev, autoNoindexDrafts: value }))}
              tr={tr}
            />
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">{tr ? "UTM adlandırma kuralı: `channel_source_campaign`" : "UTM naming convention: `channel_source_campaign`"}</p>
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">{tr ? "Canonical zorlaması: yalnızca pazaryeri sayfaları" : "Canonical enforcement: marketplace pages only"}</p>
              <p className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">{tr ? "Blog iç link minimumu: gönderi başına 3 link" : "Blog internal link minimum: 3 links/post"}</p>
            </div>
          </Panel>

          <Panel title={tr ? "Bildirim Matrisi" : "Notification Matrix"}>
            <NotificationRow event={tr ? "Yüksek riskli iade" : "High-risk refund"} teams={tr ? "Operasyon, Finans" : "Ops, Finance"} channel={tr ? "Uygulama içi + E-posta" : "In-app + Email"} tr={tr} />
            <NotificationRow event={tr ? "Başarısız ödeme yeniden denemeleri" : "Failed payout retries"} teams={tr ? "Finans" : "Finance"} channel={tr ? "Uygulama içi + Slack" : "In-app + Slack"} tr={tr} />
            <NotificationRow event={tr ? "XML beslemesi engellendi" : "XML feed blocked"} teams={tr ? "Operasyon" : "Ops"} channel={tr ? "Pager + Uygulama içi" : "Pager + In-app"} tr={tr} />
            <NotificationRow event={tr ? "SEO kritik sorunu" : "SEO critical issue"} teams={tr ? "Büyüme, İçerik" : "Growth, Content"} channel={tr ? "Uygulama içi" : "In-app"} tr={tr} />
          </Panel>

          <Panel title={tr ? "Politika Kısayolları" : "Policy Shortcuts"}>
            <div className="space-y-2">
              <Shortcut href="/admin/audit" icon="history" label={tr ? "Denetim kayıtlarında politika değişimlerini incele" : "Review policy changes in audit trail"} />
              <Shortcut href="/admin/automations" icon="automation" label={tr ? "Otomasyon güvenlik sınırlarını düzenle" : "Tune automation guardrails"} />
              <Shortcut href="/admin/risk" icon="gpp_maybe" label={tr ? "Risk taraması ve şiddet modellerini ayarla" : "Adjust risk scans and severity models"} />
              <Shortcut href="/admin/marketing" icon="campaign" label={tr ? "Kampanya yönetişim panelini aç" : "Open campaign governance panel"} />
              <Shortcut href="/admin/seo" icon="travel_explore" label={tr ? "SEO sprint panosunu aç" : "Open SEO sprint board"} />
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
  tr,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  tr: boolean;
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
          {checked ? (tr ? "Açık" : "Enabled") : tr ? "Kapalı" : "Disabled"}
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

function NotificationRow({ event, teams, channel, tr }: { event: string; teams: string; channel: string; tr: boolean }) {
  return (
    <div className="mb-2 rounded-lg border border-slate-100 p-3 text-sm last:mb-0 dark:border-slate-800">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{event}</p>
      <p className="text-xs text-slate-500">{tr ? "Ekipler" : "Teams"}: {teams}</p>
      <p className="text-xs text-slate-500">{tr ? "Kanal" : "Channel"}: {channel}</p>
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
