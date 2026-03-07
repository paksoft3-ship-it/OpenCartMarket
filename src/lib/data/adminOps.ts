import { Order } from "@/lib/types";

export type RefundStatus = "pending" | "review" | "approved" | "rejected";
export type RefundRisk = "low" | "medium" | "high";

export type PayoutStatus = "Beklemede" | "İncelemede" | "Onaylandı" | "Gonderildi" | "Basarisiz";
export type PayoutQueue = "all" | "manual" | "auto" | "exception";

export type RiskSource = "order" | "refund" | "payout";
export type RiskSeverity = "low" | "medium" | "high";

export interface RefundCase {
  id: string;
  order: string;
  customer: string;
  customerEmail: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  risk: RefundRisk;
  previousRefunds: number;
  hoursOpen: number;
}

export interface PayoutRequest {
  id: string;
  developer: string;
  amount: number;
  requestedAt: string;
  method: string;
  status: PayoutStatus;
  queue: PayoutQueue;
  reason: string;
  fee: number;
  retries: number;
}

export interface RiskEvent {
  id: string;
  source: RiskSource;
  ref: string;
  severity: RiskSeverity;
  score: number;
  reason: string;
  age: string;
}

export const refundCases: RefundCase[] = [
  { id: "RF-1042", order: "ORD-7F93A", customer: "Ahmet Y.", customerEmail: "ahmet@store.com", amount: 59, reason: "Module conflict", status: "pending", risk: "high", previousRefunds: 3, hoursOpen: 12 },
  { id: "RF-1038", order: "ORD-2BA10", customer: "Nida K.", customerEmail: "nida@shop.io", amount: 39, reason: "Not as described", status: "review", risk: "medium", previousRefunds: 1, hoursOpen: 6 },
  { id: "RF-1032", order: "ORD-1CC31", customer: "Daniel P.", customerEmail: "daniel@commerce.net", amount: 29, reason: "Duplicate purchase", status: "approved", risk: "low", previousRefunds: 0, hoursOpen: 0 },
  { id: "RF-1030", order: "ORD-8A110", customer: "Elif D.", customerEmail: "elif@myshop.com", amount: 119, reason: "Compatibility issue", status: "pending", risk: "high", previousRefunds: 2, hoursOpen: 18 },
];

export const payoutRequests: PayoutRequest[] = [
  { id: "WD-2042", developer: "PixelThemes Co.", amount: 12500, requestedAt: "06 Mar 2026", method: "Banka", status: "Beklemede", queue: "manual", reason: "Yeni hesap ilk transfer", fee: 180, retries: 0 },
  { id: "WD-2041", developer: "WebBoost Studio", amount: 7900, requestedAt: "05 Mar 2026", method: "Banka", status: "İncelemede", queue: "manual", reason: "Unusual volume increase", fee: 130, retries: 0 },
  { id: "WD-2040", developer: "SmartLabs", amount: 6250, requestedAt: "04 Mar 2026", method: "IBAN", status: "Onaylandı", queue: "auto", reason: "Healthy account", fee: 95, retries: 0 },
  { id: "WD-2038", developer: "Nexus Modules", amount: 14900, requestedAt: "03 Mar 2026", method: "Banka", status: "Basarisiz", queue: "exception", reason: "Bank rejection code 57", fee: 210, retries: 2 },
];

export function buildRiskEvents(orders: Order[], refunds: RefundCase[], payouts: PayoutRequest[]): RiskEvent[] {
  const orderEvents = orders.slice(0, 4).map((order, index) => {
    const baseScore = Math.min(95, Math.round(order.total * 0.7) + (order.status === "failed" ? 30 : order.status === "pending" ? 15 : 0));
    const severity: RiskSeverity = baseScore > 80 ? "high" : baseScore > 50 ? "medium" : "low";
    return {
      id: `RSK-O-${index + 1}`,
      source: "order" as const,
      ref: order.id,
      severity,
      score: baseScore,
      reason: order.status === "failed" ? "Failed payment confirmation" : order.status === "pending" ? "Pending fulfillment with delay risk" : "Normal checkout pattern",
      age: `${(index + 1) * 12}m`,
    };
  });

  const refundEvents = refunds.map((item, index) => ({
    id: `RSK-R-${index + 1}`,
    source: "refund" as const,
    ref: item.id,
    severity: item.risk as RiskSeverity,
    score: item.risk === "high" ? 82 : item.risk === "medium" ? 61 : 34,
    reason: item.reason,
    age: `${Math.max(1, item.hoursOpen)}h`,
  }));

  const payoutEvents = payouts.map((item, index) => ({
    id: `RSK-P-${index + 1}`,
    source: "payout" as const,
    ref: item.id,
    severity: item.queue === "exception" || item.status === "Basarisiz" ? "high" as RiskSeverity : item.queue === "manual" ? "medium" as RiskSeverity : "low" as RiskSeverity,
    score: item.queue === "exception" ? 86 : item.queue === "manual" ? 58 : 28,
    reason: item.reason,
    age: `${(index + 2) * 20}m`,
  }));

  return [...orderEvents, ...refundEvents, ...payoutEvents].sort((a, b) => b.score - a.score).slice(0, 12);
}

export function getRiskEventById(events: RiskEvent[], eventId: string) {
  return events.find((event) => event.id === eventId);
}
