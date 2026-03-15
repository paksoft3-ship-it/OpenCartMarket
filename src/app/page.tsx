import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { ProductSlider } from "@/components/marketplace/ProductSlider";
import { getProducts } from "@/lib/data/products";

export default async function Home() {
  const allProducts = await getProducts();

  // Create subsets for sliders
  const newReleases = [...allProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const bestSellers = [...allProducts]
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);

  return (
    <div className="relative flex flex-col w-full group/design-root overflow-x-hidden bg-background-light dark:bg-background-dark">
      {/* Hero Section */}
      <section className="w-full px-6 lg:px-16 xl:px-24 py-20 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 flex flex-col gap-8 text-center lg:text-left">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider w-max mx-auto lg:mx-0">
                <span className="material-symbols-outlined text-sm">new_releases</span>
                <span>Yeni Modüller Mevcut</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Modern OpenCart <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tema ve Modülleri</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Türk geliştiriciler ve mağaza sahipleri için özel olarak küratize edilmiş premium ekosistem. E-ticaret deneyiminizi bugün yükseltin.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/browse?category=themes" className="flex items-center justify-center rounded-xl h-12 px-6 bg-primary text-white hover:bg-primary/90 transition-colors text-base font-bold shadow-lg shadow-primary/20">
                Temaları İncele
              </Link>
              <Link href="/browse?category=modules" className="flex items-center justify-center rounded-xl h-12 px-6 bg-surface dark:bg-card border border-border text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-base font-bold">
                Modülleri İncele
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 mt-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-background"></div>
                <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-background"></div>
              </div>
              <p><span className="font-semibold text-slate-900 dark:text-white">Çok sayıda</span> geliştirici tarafından güveniliyor</p>
            </div>
          </div>
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10"></div>
            <div className="rounded-2xl border border-border bg-surface dark:bg-card p-2 shadow-2xl">
              <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
                <Image
                  src="https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/hero-editorial.jpg"
                  alt="NovaKur Fashion Theme preview"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">Kategoriye Göre Göz At</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { href: "/browse?category=themes", label: "Temalar", icon: "palette", img: "https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/hero-editorial.jpg" },
            { href: "/browse?category=modules", label: "Modüller", icon: "extension", img: "https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/checkout-hero.jpg" },
            { href: "/browse?category=xml-integrations", label: "XML Entegrasyonları", icon: "integration_instructions", img: "https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/category-menswear.jpg" },
            { href: "/browse?category=modules", label: "Pazarlama Araçları", icon: "campaign", img: "https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/collection-banner.jpg" },
            { href: "/browse?category=modules", label: "Ödeme Modülleri", icon: "payments", img: "https://fashion.demos.opencartkur.com/extension/novakur/catalog/view/assets/img/fashion/checkout-trust-bg.jpg" },
          ].map((cat) => (
            <Link key={cat.href + cat.label} className="group relative rounded-xl overflow-hidden border border-border aspect-[3/2] flex items-end transition-all hover:shadow-lg hover:-translate-y-0.5" href={cat.href}>
              <Image src={cat.img} alt={cat.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="relative z-10 p-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-white text-lg">{cat.icon}</span>
                <h3 className="font-display text-sm font-bold text-white leading-tight">{cat.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product Sliders */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col gap-20 w-full">
        <ProductSlider
          title="Çok Satanlar"
          badge={{ text: "Bestseller", type: "trending" }}
          products={bestSellers}
          viewAllLink="/browse?sort=popular"
        />

        <ProductSlider
          title="Yeni Gelenler"
          badge={{ text: "Yeni", type: "new" }}
          products={newReleases}
          viewAllLink="/browse?sort=newest"
        />
      </div>

      {/* Sell on Marketplace Section */}
      <section className="relative overflow-hidden py-24 bg-slate-50 dark:bg-slate-900/50 border-y border-border">
        {/* Subtle abstract background gradient */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Copy & CTAs */}
            <div className="col-span-1 lg:col-span-6 flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-primary relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                </span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Satıcı Portalı</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Eklentilerinizi Türkiye’nin <br className="hidden xl:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">En Büyük</span> OpenCart Pazaryerinde Satın
              </h2>
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Binlerce aktif mağaza sahibine ulaşın, ürünlerinizi güvenle satın ve düzenli gelir elde edin.
              </p>
              <ul className="flex flex-col gap-4 mt-2">
                {[
                  "%80'e varan yüksek kazanç oranları",
                  "Gelişmiş satış analitiği ve raporlama",
                  "Otomatik lisanslama araçları",
                  "Global pazarlama ve SEO desteği"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <span className="material-symbols-outlined text-sm font-bold">check</span>
                    </div>
                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link href="/developer/register" className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white text-base font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                  Satıcı Ol
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
                <Link href="/guides/seller" className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-surface dark:bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-border text-base font-semibold transition-all">
                  Satıcı Rehberini Gör
                </Link>
              </div>
            </div>

            {/* Right Side: Mini Dashboard Preview */}
            <div className="col-span-1 lg:col-span-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-indigo-400/20 blur-2xl rounded-3xl z-0 pointer-events-none"></div>
              <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-border overflow-hidden transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] hover:rotate-0 transition-transform duration-500">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">storefront</span>
                    </div>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Satıcı Paneli</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border">
                      <p className="text-xs text-slate-500 font-medium mb-1">Aylık Kazanç</p>
                      <p className="text-2xl font-bold flex items-baseline gap-2 text-slate-900 dark:text-white">
                        ₺---
                        <span className="text-xs font-semibold text-emerald-500 flex items-center">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          14%
                        </span>
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-border">
                      <p className="text-xs text-slate-500 font-medium mb-1">Aktif Üyeler</p>
                      <p className="text-2xl font-bold flex items-baseline gap-2 text-slate-900 dark:text-white">
                        ---
                        <span className="text-xs font-semibold text-emerald-500 flex items-center">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          8%
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Recent Orders List placeholder */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-slate-900 dark:text-white">Son Siparişler</h3>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">AH</div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Pro SEO Modülü</p>
                            <p className="text-xs text-slate-500">Ahmet Y. • 2 dk önce</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-500">+₺299</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col gap-4 max-w-3xl mb-12">
          <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Pazaryeri Avantajları
          </h2>
          <p className="text-lg font-normal text-slate-600 dark:text-slate-400">
            OpenCart temanız veya modülünüz için neden bizi seçmelisiniz? Türkiye'nin en büyük ve güvenilir ekosistemiyle tanışın.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "package", title: "Temiz Kurulum Paketleri", desc: "Kolay ve sorunsuz kurulum için optimize edilmiş temiz paketler." },
            { icon: "verified", title: "Doğrulanmış Geliştiriciler", desc: "Sadece uzman ve yetenekleri onaylanmış geliştiriciler tarafından kodlanmış ürünler." },
            { icon: "check_circle", title: "Uyumluluk Kontrolleri", desc: "Farklı OpenCart sürümleri ve popüler eklentilerle titizlikle test edilmiş ürünler." },
            { icon: "support_agent", title: "Hızlı Destek", desc: "Geliştiricilerden ve platform ekibinden hızlı ve çözüm odaklı profesyonel destek." },
            { icon: "update", title: "Düzenli Güncellemeler", desc: "Yeni OpenCart sürümlerine uyum sağlayan ve sürekli geliştirilen güncel eklentiler." },
            { icon: "policy", title: "İade Dostu Politika", desc: "Güvenli alışveriş deneyimi sunan adil ve şeffaf iade politikası." }
          ].map((benefit, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-xl border border-border bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-primary flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <span className="material-symbols-outlined text-2xl">{benefit.icon}</span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{benefit.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-normal leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-24 bg-slate-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20 text-center">
            <h4 className="text-slate-400 text-sm font-semibold leading-normal tracking-widest uppercase mb-8">Güvenilen Markalar</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16 opacity-40">
              {/* Logo placeholders can be simplified for now */}
              <div className="text-lg font-bold">LOGO 1</div>
              <div className="text-lg font-bold">LOGO 2</div>
              <div className="text-lg font-bold">LOGO 3</div>
              <div className="text-lg font-bold">LOGO 4</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Emre Can", store: "Can Pet Market", text: "Bu OpenCart teması mağazamızın görünümünü tamamen değiştirdi. Çok modern ve hızlı çalışıyor." },
              { name: "Ayşe Yılmaz", store: "Moda Butik", text: "Modüller tam istediğimiz gibi. Kurulumu çok kolay oldu ve satışlarımızı gözle görülür şekilde artırdı." },
              { name: "Ahmet Demir", store: "Tekno Mağaza", text: "Türkiye pazarı için özel geliştirilmiş eklentileri bulmak harika. Hem kaliteli hem de uygun fiyatlı." }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-8 flex flex-col gap-6 border border-slate-700/50">
                <div className="flex gap-1 text-emerald-400">
                  {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[20px]">star</span>)}
                </div>
                <p className="text-lg font-medium leading-relaxed italic text-slate-200">"{testimonial.text}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-primary">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-base font-semibold leading-tight">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.store}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ & Support Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <h2 className="text-4xl font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Sıkça Sorulan Sorular</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">Pazaryerimiz, temalar ve modüller hakkında en çok merak edilen soruların cevaplarını burada bulabilirsiniz.</p>

            <div className="space-y-4">
              {[
                { q: "Kurulum ne kadar sürer?", a: "Modüller için 2-3 dakika, temalar için ise 10-15 dakika içinde kurulum tamamlanabilir." },
                { q: "OpenCart 3 ve 4 uyumluluğu?", a: "Pazaryerimizdeki tüm ürünlerin desteklediği OpenCart sürümleri ürün detay sayfasında açıkça belirtilmiştir." },
                { q: "İade politikası nedir?", a: "Ürün çalışmıyorsa ve geliştirici sorunu çözemezse, 14 gün içerisinde iade talebinde bulunabilirsiniz." },
                { q: "Lisans kullanımı nasıl çalışır?", a: "Satın aldığınız her ürün tek bir alan adı (domain) için geçerlidir." }
              ].map((faq, i) => (
                <details key={i} className="group bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{faq.q}</h3>
                    <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400">
                    <p>{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white dark:bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-3xl text-primary">support_agent</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Aradığınızı bulamadınız mı?</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-sm leading-relaxed">Destek ekibimiz sorularınızı yanıtlamak için hazır.</p>
              <div className="space-y-3">
                <Link href="/contact" className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-white bg-primary hover:bg-primary/90 font-semibold transition-colors shadow-lg shadow-primary/20 gap-2 text-sm">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  İletişime Geç
                </Link>
                <Link href="/docs" className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-slate-700 dark:text-slate-300 bg-surface dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors gap-2 border border-border text-sm">
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  Dokümantasyon
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-footer Highlight */}
      <section className="bg-primary text-white py-16 w-full overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">E-ticaret Sitenizi Bir Üst Seviyeye Taşıyın</h2>
          <p className="text-lg text-white/80 max-w-2xl">
            Modern tasarımlar ve güçlü modüllerle mağazanızı profesyonelleştirin. Hemen keşfetmeye başlayın.
          </p>
          <div className="flex gap-4">
            <Link href="/browse" className="bg-white text-primary hover:bg-white/90 h-12 px-8 flex items-center justify-center rounded-xl font-bold transition-all shadow-xl">
              Hemen Başla
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

