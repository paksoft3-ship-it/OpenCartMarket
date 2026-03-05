import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Download, BadgeCheck, Clock, Headphones, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Arda Yılmaz - Developer Profile | OpenCart Market',
    description: 'Expert OpenCart developer specializing in high-performance themes and modules.',
};

export default function AuthorProfilePage() {
    return (
        <main className="flex flex-1 flex-col items-center py-10 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto w-full gap-8">
            {/* Header Section */}
            <section className="w-full flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative h-32 w-32 shadow-xl ring-4 ring-white dark:ring-slate-800 rounded-full overflow-hidden">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4gCi2Tox_VlEKA-60ZBosb-86Af0UX9f2rD0c5IFcG4n1Yt9YT9NTCcQ_o1g_AVliUIg-15bfXPox90paqHi2whakueymuRpGjoCsxq8cgLGdf-M4pDxqP3-OKmZXPOYWow1q9XDuy1jiEVip-iYbZy4xApeL3Lyh1XO1Rq9u134v-Zi7HeHfD0PrdKvThPghKzlOxH3hidlQ6UsLV5RWy4vREOlZOguyh_rG00fS47I1WPn7dg6WLBPh9d0Fps5bIqKmN1hcOIs"
                            alt="Developer portrait photo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-slate-100">Arda Yılmaz</h1>
                        <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-sm font-semibold">
                            <BadgeCheck className="w-4 h-4" />
                            Verified Developer
                        </div>
                    </div>
                </div>

                <div className="flex w-full max-w-xs gap-3 mt-2">
                    <Button className="flex-1 font-bold shadow-sm h-10">Contact</Button>
                    <Button variant="outline" className="flex-1 font-bold shadow-sm h-10">Follow</Button>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-2xl">
                    <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-4 items-center text-center transition-transform hover:-translate-y-1">
                        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">4.9<span className="text-lg text-slate-400 font-medium">/5</span></p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rating</p>
                    </div>
                    <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-4 items-center text-center transition-transform hover:-translate-y-1">
                        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">24</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Products</p>
                    </div>
                    <div className="flex flex-1 min-w-[120px] flex-col gap-1 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 p-4 items-center text-center transition-transform hover:-translate-y-1">
                        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">12k+</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Downloads</p>
                    </div>
                </div>
            </section>

            {/* Developer Bio Section */}
            <section className="w-full flex flex-col md:flex-row gap-8 bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mt-4 text-slate-900 dark:text-slate-100">
                <div className="w-full md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700 pb-6 md:pb-0 md:pr-8">
                    <h3 className="text-lg font-semibold mb-2">Trust Indicators</h3>
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <p className="text-sm font-medium">Response Time</p>
                        </div>
                        <p className="text-sm font-semibold">&lt; 2 hours</p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Headphones className="w-4 h-4" />
                            <p className="text-sm font-medium">Support Quality</p>
                        </div>
                        <p className="text-sm font-semibold">High</p>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm font-medium">Member since</p>
                        </div>
                        <p className="text-sm font-semibold">2021</p>
                    </div>
                </div>
                <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-3">About the Developer</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed">
                        Expert OpenCart developer specializing in high-performance themes and modules. Focused on delivering fast, modern, and SEO-optimized solutions for Turkish store owners. My products are built with modern tech stacks, ensuring clean code, exceptional speed, and easy customization for e-commerce growth.
                    </p>
                </div>
            </section>

            {/* Tabs & Product Grid */}
            <section className="w-full mt-8">
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 overflow-x-auto no-scrollbar">
                    <button className="text-primary border-b-2 border-primary pb-3 px-4 font-semibold text-sm whitespace-nowrap">Themes</button>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-b-2 border-transparent pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors">Modules</button>
                    <button className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border-b-2 border-transparent pb-3 px-4 font-medium text-sm whitespace-nowrap transition-colors">Reviews (142)</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Product Card 1 */}
                    <Link href="/product/nexus-theme" className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer">
                        <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfqvULaxsuhTn9c9BHdRAcj-o2GknDc5MdlUCL89LcP221mbeCYOPDFxJlzHulXXb_dzVXw1qtG6GWIsMUUzVqUAb5f0Jz0yebYw8_GUo44n03RD9wWnBwc8OTPtKjUcaTpSmFW2VEu9y5x3zogzH0C_IihgYbx2j6iFOJwLtxhouSuprsx3rZxTBXXy8jEdgYw39YlwfRS-_oPxo8Pid_0SS7BXS-RCkMil6izKqvG9dM7ajIL5ea9hRLsXt_isagrjdivp6QvUw"
                                alt="Dashboard theme preview"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                                $49.00
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">Nexus - Modern Admin Theme</h4>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">A clean, responsive admin dashboard theme for OpenCart 3.x with dark mode support.</p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                    <Star className="w-4 h-4 fill-current" />
                                    4.9 (42)
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                    <Download className="w-4 h-4" />
                                    2.4k
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Product Card 2 */}
                    <Link href="/product/lumina-theme" className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer">
                        <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtHCNFDuObUIWCQUFJ7Jn80i11R6j0jJceX8-OlCFlPvmGZqWpX989ygJeXCk25yIyMXzi4JnzJsZZo7tpZ9mbBXvD9G5LUW2TiHsPXVN6dAFpHW1X762Mxv7_jRThr8roCDiFCtjrpzsQc1M4ULt3XY8dzGedh8qbhB33u7yl7y8zRZ7Adqg4m1nc7Tge-DSBnua-ko7OP8mk8BNUuZ3XH3qpw-mMinGoMX7wAm7_pixbsYKpWYqp0ywfe6hrYirACcqdcQsJGKg"
                                alt="Storefront theme preview"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                                $89.00
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">Lumina - Minimal Storefront</h4>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">High-conversion, minimalist theme focused on speed and mobile experience.</p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                    <Star className="w-4 h-4 fill-current" />
                                    5.0 (28)
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                    <Download className="w-4 h-4" />
                                    1.1k
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Product Card 3 */}
                    <Link href="/product/speed-optimizer" className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer">
                        <div className="h-48 w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                <span className="material-symbols-outlined text-6xl text-primary/50">speed</span>
                            </div>
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                                $29.00
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">Speed Optimizer Pro</h4>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Advanced caching and asset minification module for 90+ Google PageSpeed score.</p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                    <Star className="w-4 h-4 fill-current" />
                                    4.8 (156)
                                </div>
                                <div className="flex items-center gap-1 text-slate-400 text-sm">
                                    <Download className="w-4 h-4" />
                                    5.8k
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>
        </main>
    );
}
