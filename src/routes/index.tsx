import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Package,
  ShoppingBag,
  Wallet,
  AlertTriangle,
  MessageCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { orders, products, formatLKR, statusFlow, statusLabels } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Glow OMS" },
      { name: "description", content: "Live view of WhatsApp orders, payments, inventory and fulfillment for the Glow cosmetics OMS." },
      { property: "og:title", content: "Dashboard — Glow OMS" },
      { property: "og:description", content: "Live view of WhatsApp orders, payments, inventory and fulfillment." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const openOrders = orders.filter((o) => !["delivered", "returned"].includes(o.status));
  const revenue = orders
    .filter((o) => o.payment === "paid")
    .reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty * i.price, 0), 0);
  const codPending = orders
    .filter((o) => o.method === "cod" && o.payment === "pending")
    .reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty * i.price, 0), 0);
  const lowStock = products.filter((p) => p.stock <= p.threshold);

  const funnel = statusFlow.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  const kpis = [
    { label: "Open orders", value: openOrders.length.toString(), delta: "+3 today", icon: ShoppingBag, tint: "--status-new" },
    { label: "Revenue (7d)", value: formatLKR(revenue), delta: "+12.4%", icon: TrendingUp, tint: "--status-delivered" },
    { label: "COD to reconcile", value: formatLKR(codPending), delta: `${orders.filter((o) => o.method === "cod" && o.payment === "pending").length} orders`, icon: Wallet, tint: "--pay-pending" },
    { label: "Low stock SKUs", value: lowStock.length.toString(), delta: "Needs restock", icon: AlertTriangle, tint: "--status-returned" },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live overview of the WhatsApp order flow."
      />
      <div className="p-6 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {k.label}
                </span>
                <div
                  className="h-8 w-8 rounded-md grid place-items-center"
                  style={{ background: `color-mix(in oklch, var(${k.tint}) 14%, transparent)`, color: `var(${k.tint})` }}
                >
                  <k.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Funnel + WhatsApp preview */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold tracking-tight">Order status funnel</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  New → Confirmed → Packed → Handed to Courier → In Transit → Delivered
                </p>
              </div>
              <Link
                to="/orders"
                className="text-xs text-[var(--brand-dark)] hover:underline inline-flex items-center gap-1"
              >
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {funnel.map((f) => (
                <div key={f.status} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 text-sm text-muted-foreground">
                    {statusLabels[f.status]}
                  </div>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(f.count / funnelMax) * 100}%`,
                        background: `var(--status-${f.status})`,
                      }}
                    />
                  </div>
                  <div className="w-8 text-right text-sm font-medium tabular-nums">
                    {f.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-[var(--brand)] grid place-items-center text-primary-foreground">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-semibold tracking-tight text-sm">Latest chat → order</h2>
                <p className="text-[11px] text-muted-foreground">
                  From Ishara Kumar · OMS-2418
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 rounded-lg bg-[color:oklch(0.97_0.01_150)] p-3">
              {orders[0].chat.slice(0, 4).map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                    m.from === "customer"
                      ? "bg-white border border-border"
                      : "ml-auto"
                  }`}
                  style={
                    m.from !== "customer"
                      ? { background: "var(--chat-bubble)" }
                      : undefined
                  }
                >
                  {m.text}
                </div>
              ))}
            </div>
            <Link
              to="/orders/$id"
              params={{ id: orders[0].id }}
              className="mt-4 inline-flex items-center gap-1 text-xs text-[var(--brand-dark)] hover:underline"
            >
              Open order <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Recent orders + Low stock */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold tracking-tight">Recent orders</h2>
              <Link to="/orders" className="text-xs text-[var(--brand-dark)] hover:underline">
                See all
              </Link>
            </div>
            <div className="divide-y divide-border">
              {orders.slice(0, 5).map((o) => (
                <Link
                  key={o.id}
                  to="/orders/$id"
                  params={{ id: o.id }}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {o.id}
                      </span>
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {relative(o.createdAt)}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm font-medium truncate">
                      {o.customerName}{" "}
                      <span className="text-muted-foreground font-normal">· {o.city}</span>
                    </div>
                  </div>
                  <div className="text-sm font-medium tabular-nums">
                    {formatLKR(o.items.reduce((a, i) => a + i.qty * i.price, 0))}
                  </div>
                  <StatusBadge status={o.status} />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-semibold tracking-tight">Low stock</h2>
              <Link to="/inventory" className="text-xs text-[var(--brand-dark)] hover:underline">
                Inventory
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {lowStock.map((p) => (
                <li key={p.sku} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-9 w-9 rounded-md bg-[var(--brand-soft)] grid place-items-center text-[var(--brand-dark)]">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {p.name}
                      {p.shade && <span className="text-muted-foreground"> · {p.shade}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-semibold tabular-nums ${p.stock === 0 ? "text-[color:var(--status-returned)]" : ""}`}>
                      {p.stock}
                    </div>
                    <div className="text-[10px] text-muted-foreground">/ {p.threshold}</div>
                  </div>
                </li>
              ))}
            </ul>
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