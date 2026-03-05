export type TicketStatus = "open" | "answered" | "resolved";

export interface SupportMessage {
  id: string;
  author: "customer" | "support";
  authorName: string;
  createdAt: string;
  content: string;
}

export interface SupportTicket {
  id: string;
  product: string;
  subject: string;
  status: TicketStatus;
  updatedAt: string;
  priority: "low" | "normal" | "high";
  messages: SupportMessage[];
}

export const supportTickets: SupportTicket[] = [
  {
    id: "TCK-1042",
    product: "Ultima Theme",
    subject: "Ana sayfada slider görünmüyor",
    status: "open",
    updatedAt: "2026-03-05T08:00:00.000Z",
    priority: "high",
    messages: [
      {
        id: "m1",
        author: "customer",
        authorName: "Ahmet Yılmaz",
        createdAt: "2026-03-05T06:30:00.000Z",
        content: "Kurulumdan sonra ana sayfa slider alanı boş görünüyor. OCMOD yeniledim ama devam ediyor.",
      },
      {
        id: "m2",
        author: "support",
        authorName: "Destek Ekibi",
        createdAt: "2026-03-05T07:10:00.000Z",
        content: "Lütfen tema ayarlarından Home Slider bloğunun aktif olduğunu kontrol edin ve cache temizleyin.",
      },
    ],
  },
  {
    id: "TCK-1038",
    product: "Quick Checkout",
    subject: "Ödeme adımında kupon kodu hatası",
    status: "answered",
    updatedAt: "2026-03-04T11:20:00.000Z",
    priority: "normal",
    messages: [],
  },
  {
    id: "TCK-1025",
    product: "Multi-Vendor Pack",
    subject: "Lisansı yeni domaine taşıma",
    status: "resolved",
    updatedAt: "2026-03-01T15:05:00.000Z",
    priority: "low",
    messages: [],
  },
];

export function getTicketById(id: string) {
  return supportTickets.find((ticket) => ticket.id === id) ?? null;
}
