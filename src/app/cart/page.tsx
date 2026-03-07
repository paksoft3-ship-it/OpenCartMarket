"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function CartPage() {
  const { cart, removeFromCart } = useAppStore();
  const subtotal = cart.reduce((sum, item) => sum + item.product.price, 0);

  return (
    <div className="mx-auto min-h-[calc(100vh-64px)] w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Sepetim</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Satın alma öncesi ürünlerinizi kontrol edin.</p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-slate-500">Marketplace sayfasından ürün ekleyebilirsiniz.</p>
          <Link href="/browse" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">
            Ürünlere Git
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.product.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                          <Image alt={item.product.name} className="object-cover" fill src={item.product.images[0]} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.product.name}</p>
                          <p className="text-xs text-slate-500">{item.product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 capitalize">{item.product.categoryId.replace("-", " ")}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-slate-100">${item.product.price.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-sm font-semibold text-red-600 hover:underline" onClick={() => removeFromCart(item.product.id)}>
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Sipariş Özeti</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Ara Toplam</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>KDV (18%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">${(subtotal * 0.18).toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 dark:text-slate-100">Toplam</span>
                <span className="text-xl font-bold text-primary">${(subtotal * 1.18).toFixed(2)}</span>
              </div>
            </div>
            <Link className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90" href="/checkout">
              Ödemeye Geç
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
