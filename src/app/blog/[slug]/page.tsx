import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blogPosts";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link className="text-sm font-semibold text-primary hover:underline" href="/blog">
        ← Bloga Dön
      </Link>

      <header className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{post.category}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{post.author} • {post.readTime} • {new Date(post.publishedAt).toLocaleDateString("tr-TR")}</p>
      </header>

      <div className="relative mt-6 h-[320px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <Image alt={post.title} className="object-cover" fill src={post.cover} />
      </div>

      <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
