import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yasal Belgeler | OpenCart Market",
  description: "Kullanım koşulları ve yasal politika belgeleri.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 dark:bg-slate-950">
      <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Kullanım Koşulları</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          OpenCart Pazaryeri hizmetlerini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
        </p>

        <section className="mt-8 space-y-6 text-sm leading-7 text-slate-700 dark:text-slate-300">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">1. Hesap Güvenliği</h2>
            <p>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz. Şüpheli aktiviteleri destek ekibine bildirmeniz gerekir.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">2. Lisans Kullanımı</h2>
            <p>Satın alınan ürünler lisans şartlarına tabidir. İzinsiz dağıtım ve çoğaltma yasaktır.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">3. Ödeme ve İade</h2>
            <p>İade talepleri ürünün teknik olarak çalışmaması gibi doğrulanabilir durumlarda değerlendirilir.</p>
          </div>
        </section>
      </article>
    </div>
  );
}
