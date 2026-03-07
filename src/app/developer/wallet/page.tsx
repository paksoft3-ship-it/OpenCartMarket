"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const transactions = [
  { id: "TX-5012", type: "Satış: Ultima Theme Pro", date: "06 Mar 2026, 14:20", amount: "+₺1,250", status: "Tamamlandı" },
  { id: "TX-5011", type: "Para Çekme: Banka Hesabı", date: "05 Mar 2026, 09:30", amount: "-₺5,000", status: "İşleniyor" },
  { id: "TX-5010", type: "Satış: SEO Module", date: "04 Mar 2026, 18:45", amount: "+₺450", status: "Beklemede" },
];

export default function DeveloperWalletPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cüzdan ve Ödemeler</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Bakiyenizi yönetin ve para çekme talebi oluşturun.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90">
              Ödeme Talebi Oluştur
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ödeme Talebi Oluştur</DialogTitle>
              <DialogDescription>Talebiniz onay sonrası banka hesabınıza aktarılır.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" defaultValue="₺5,000" />
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option>TR62 0006 2000 0000 1234 5678 90</option>
              </select>
              <textarea className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" placeholder="Açıklama (opsiyonel)" rows={3} />
            </div>
            <DialogFooter>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">Talebi Gönder</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card label="Kullanılabilir Bakiye" value="₺42,850" accent />
        <Card label="Bekleyen Kazanç" value="₺8,200" />
        <Card label="Sonraki Ödeme" value="15 Mar 2026" />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Banka Hesabı (IBAN)</p>
            <p className="mt-1 font-mono text-sm text-slate-700 dark:text-slate-200">TR62 0006 2000 0000 1234 5678 90</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Onaylı</span>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">İşlem Geçmişi</h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60">
            <tr>
              <th className="px-5 py-3">İşlem</th>
              <th className="px-5 py-3">Tarih</th>
              <th className="px-5 py-3">Tutar</th>
              <th className="px-5 py-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={item.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{item.type}</td>
                <td className="px-5 py-4 text-sm text-slate-500">{item.date}</td>
                <td className={`px-5 py-4 text-sm font-bold ${item.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900 dark:text-slate-100"}`}>
                  {item.amount}
                </td>
                <td className="px-5 py-4"><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Card({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent ? "text-primary" : "text-slate-900 dark:text-slate-100"}`}>{value}</p>
    </div>
  );
}
