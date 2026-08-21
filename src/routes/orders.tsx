import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";
import { orders, formatLKR, statusFlow, statusLabels, type OrderStatus } from "@/lib/mock-data";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Glow OMS" },
      { name: "description", content: "All WhatsApp orders with status, payment and courier details." },
      { property: "og:title", content: "Orders — Glow OMS" },
      { property: "og:description", content: "All WhatsApp orders with status, payment and courier details." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [q, setQ] = useState("");
  const visible = orders.filter((o) => {
    if (filter !== "all" && o.status !== filter) return false;
    if (q && !`${o.id} ${o.customerName} ${o.city}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const tabs: { key: OrderStatus | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: orders.length },
    ...statusFlow.map((s) => ({
      key: s,
      label: statusLabels[s],
      count: orders.filter((o) => o.status === s).length,
    })),
    { key: "returned", label: "Returned", count: orders.filter((o) => o.status === "returned").length },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order captured by the WhatsApp bot."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-secondary">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">
              <Plus className="h-4 w-4" /> Manual order
            </button>
          </>
        }
      />
      <div className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm w-72 max-w-full">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search order, customer, city…"
              className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-secondary">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>

        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === t.key
                  ? "bg-[var(--brand-soft)] text-[var(--brand-dark)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_130px_130px_100px_150px_130px] items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            <div>Order</div>
            <div>Customer</div>
            <div>Placed</div>
            <div>Total</div>
            <div>Method</div>
            <div>Status</div>
            <div>Payment</div>
          </div>
          <div className="divide-y divide-border">
            {visible.map((o) => (
              <Link
                key={o.id}
                to="/orders/$id"
                params={{ id: o.id }}
                className="grid grid-cols-[120px_1fr_130px_130px_100px_150px_130px] items-center gap-3 px-4 py-3 text-sm hover:bg-secondary/50 transition-colors"
              >
                <div className="font-mono text-xs">{o.id}</div>
                <div>
                  <div className="font-medium truncate">{o.customerName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {o.whatsapp} · {o.city}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{relative(o.createdAt)}</div>
                <div className="tabular-nums font-medium">
                  {formatLKR(o.items.reduce((a, i) => a + i.qty * i.price, 0))}
                </div>
                <div className="text-xs uppercase text-muted-foreground">{o.method}</div>
                <div>
                  <StatusBadge status={o.status} />
                </div>
                <div>
                  <PaymentBadge status={o.payment} />
                </div>
              </Link>
            ))}
            {visible.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No orders match this filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function relative(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 3600_000;
  if (diff < 1) return `${Math.round(diff * 60)}m ago`;
  if (diff < 24) return `${Math.round(diff)}h ago`;
  return `${Math.round(diff / 24)}d ago`;
}