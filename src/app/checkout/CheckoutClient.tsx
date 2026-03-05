"use client";

import { useAppStore } from "@/lib/store";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutClient() {
    const { cart, removeFromCart, clearCart } = useAppStore();
    const router = useRouter();

    // To avoid hydration mismatch for cart state
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const subtotal = cart.reduce((sum, item) => sum + item.product.price, 0);
    const tax = subtotal * 0.18; // 18% KDV
    const total = subtotal + tax;

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();

        // Create mock order in localStorage
        const newOrder = {
            id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            date: new Date().toISOString(),
            total,
            status: 'completed',
            items: cart.map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price
            }))
        };

        const existingOrdersStr = localStorage.getItem('mock_orders') || '[]';
        const existingOrders = JSON.parse(existingOrdersStr);
        localStorage.setItem('mock_orders', JSON.stringify([newOrder, ...existingOrders]));

        // Also create mock licenses
        const newLicenses = cart.map((item, idx) => ({
            id: `LIC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            productId: item.product.id,
            productName: item.product.name,
            key: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            domain: null,
            status: 'active',
            expiresAt: null
        }));

        const existingLicensesStr = localStorage.getItem('mock_licenses') || '[]';
        const existingLicenses = JSON.parse(existingLicensesStr);
        localStorage.setItem('mock_licenses', JSON.stringify([...newLicenses, ...existingLicenses]));

        clearCart();
        toast.success("Ödeme başarıyla tamamlandı!");
        router.push('/checkout/success');
    };

    if (!mounted) return null;

    if (cart.length === 0) {
        return (
            <Container className="py-24 text-center max-w-2xl">
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Sepetiniz boş</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Henüz herhangi bir premium OpenCart eklentisi eklemediniz.
                </p>
                <Link href="/browse">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-6 rounded-xl">Marketplace'e Göz At</Button>
                </Link>
            </Container>
        );
    }

    return (
        <form onSubmit={handleCheckout} className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Güvenli Ödeme</h2>
                <p className="text-slate-500 dark:text-slate-400">Siparişinizi tamamlamak için ödeme bilgilerinizi girin.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Payment Details */}
                <div className="lg:col-span-7 space-y-8">
                    <section>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ödeme Yöntemi</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <label className="relative flex flex-col items-center justify-center p-5 rounded-xl border-2 border-primary bg-primary/5 dark:bg-primary/10 cursor-pointer transition-all">
                                <input type="radio" name="payment_method" value="credit_card" className="sr-only" defaultChecked />
                                <span className="material-symbols-outlined text-primary text-3xl mb-2">credit_card</span>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Kredi Kartı</span>
                                <span className="absolute top-3 right-3 text-primary">
                                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>check_circle</span>
                                </span>
                            </label>
                            <label className="relative flex flex-col items-center justify-center p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all">
                                <input type="radio" name="payment_method" value="iyzico" className="sr-only" />
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl mb-2">account_balance_wallet</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">iyzico</span>
                            </label>
                            <label className="relative flex flex-col items-center justify-center p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer hover:border-primary/50 dark:hover:border-primary/50 transition-all">
                                <input type="radio" name="payment_method" value="stripe" className="sr-only" />
                                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl mb-2">payments</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Stripe</span>
                            </label>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 sm:p-8">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Kart Bilgileri</h3>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="card_number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kart Numarası</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>credit_card</span>
                                    </div>
                                    <input type="text" id="card_number" required className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" placeholder="0000 0000 0000 0000" />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none gap-1">
                                        <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-slate-200 dark:bg-slate-700 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="expiry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Son Kullanma (AA/YY)</label>
                                    <input type="text" id="expiry" required className="block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" placeholder="AA / YY" />
                                </div>
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CVC/CVV</label>
                                    <div className="relative">
                                        <input type="text" id="cvc" required className="block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" placeholder="123" />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-help">
                                            <span className="material-symbols-outlined text-slate-400 hover:text-slate-600" style={{ fontSize: "18px" }}>help</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name_on_card" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kart Üzerindeki İsim</label>
                                <input type="text" id="name_on_card" required className="block w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" placeholder="Ad Soyad" />
                            </div>
                        </div>
                    </section>

                    <section>
                        <label htmlFor="coupon" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Kupon Kodu</label>
                        <div className="flex gap-3">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-slate-400" style={{ fontSize: "20px" }}>local_offer</span>
                                </div>
                                <input type="text" id="coupon" className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" placeholder="İndirim kodunuzu girin" />
                            </div>
                            <button type="button" className="px-5 py-2.5 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900">
                                Uygula
                            </button>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-700 p-6 sm:p-8 sticky top-24">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Sipariş Özeti</h3>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                                    <div className="relative h-16 w-16 overflow-hidden flex-shrink-0 rounded-lg bg-gradient-to-br border border-slate-100 dark:border-slate-700 flex items-center justify-center">
                                        <Image src={item.product.images[0] || "https://picsum.photos/seed/placeholder/800/600"} alt={item.product.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 capitalize">{item.product.categoryId.replace('-', ' ')}</p>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight pr-4">{item.product.name}</h4>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">${item.product.price.toFixed(2)}</span>
                                        <button type="button" onClick={() => removeFromCart(item.product.id)} className="mt-2 text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 text-sm mb-6 border-t border-slate-100 dark:border-slate-700 pt-6">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Ara Toplam</span>
                                <span className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>KDV (%18)</span>
                                <span className="font-medium text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-4 border-t border-slate-100 dark:border-slate-700 mb-6">
                            <span className="text-base font-bold text-slate-900 dark:text-white">Toplam</span>
                            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>

                        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-4 rounded-xl font-semibold text-base hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800 transition-all shadow-lg shadow-primary/25">
                            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>lock</span>
                            Güvenle Satın Al
                        </button>

                        <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-slate-100 dark:border-slate-700 pt-6">
                            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg">verified_user</span>
                                    <span className="text-xs font-medium">256-bit SSL</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-lg">shield</span>
                                    <span className="text-xs font-medium">Güvenli Ödeme</span>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                                Ödeme bilgileriniz şifrelenerek iletilir ve sistemimizde saklanmaz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
