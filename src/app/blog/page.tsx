import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/data/blogPosts";

export const metadata = {
  title: "Blog | OpenCart Marketplace",
  description: "Marketplace growth, SEO, and OpenCart product strategy articles.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  if (posts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Marketplace Blog</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">SEO, marketing, and product growth playbooks for OpenCart sellers.</p>
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300">Henüz blog yazısı bulunmamaktadır.</p>
      </div>
    );
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Marketplace Blog</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">SEO, marketing, and product growth playbooks for OpenCart sellers.</p>
        </div>
      </div>

      <article className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[260px]">
            <Image alt={featured.title} className="object-cover" fill src={featured.cover} />
          </div>
          <div className="p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{featured.category}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{featured.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{featured.excerpt}</p>
            <p className="mt-4 text-xs text-slate-500">{featured.author} • {featured.readTime}</p>
            <Link className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90" href={`/blog/${featured.slug}`}>
              Yazıyı Oku
            </Link>
          </div>
        </div>
      </article>

      <div className="grid gap-6 md:grid-cols-2">
        {rest.map((post) => (
          <article key={post.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="relative h-48">
              <Image alt={post.title} className="object-cover" fill src={post.cover} />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">{post.author} • {post.readTime}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-primary hover:underline" href={`/blog/${post.slug}`}>
                Devamını Oku
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
