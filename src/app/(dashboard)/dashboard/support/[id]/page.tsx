import Link from "next/link";
import { notFound } from "next/navigation";
import { getTicketById } from "@/lib/data/supportTickets";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TicketDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const ticket = getTicketById(resolvedParams.id);

  if (!ticket) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h1>
          <p className="text-sm text-slate-500">{ticket.id} • {ticket.product}</p>
        </div>
        <Link href="/dashboard/support" className="text-sm font-semibold text-primary hover:underline">Listeye Dön</Link>
      </div>

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={[
              "max-w-[80%] rounded-xl px-4 py-3 text-sm",
              message.author === "customer"
                ? "ml-auto bg-primary text-white"
                : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
            ].join(" ")}
          >
            <p className="mb-1 text-xs font-semibold opacity-80">{message.authorName}</p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Yanıtınız</label>
        <textarea rows={5} className="w-full rounded-lg border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" placeholder="Yanıtınızı yazın..." />
        <button type="submit" className="mt-4 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white">Yanıt Gönder</button>
      </form>
    </div>
  );
}
