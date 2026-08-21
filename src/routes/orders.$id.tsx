import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Phone, Truck, MessageCircle, CheckCircle2, Circle, Package } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, PaymentBadge } from "@/components/status-badge";
import { orders, formatLKR, statusFlow, statusLabels, type Order } from "@/lib/mock-data";

export const Route = createFileRoute("/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Glow OMS` },
      { name: "description", content: `Order ${params.id} detail: items, chat history, courier and payment.` },
      { property: "og:title", content: `${params.id} — Glow OMS` },
      { property: "og:description", content: `Order ${params.id} detail: items, chat history, courier and payment.` },
    ],
  }),
  loader: ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    if (!order) throw notFound();
    return { order: order as Order };
  },
  component: OrderDetail,
});

function OrderDetail() {
  const { order } = Route.useLoaderData() as { order: Order };
  const total = order.items.reduce((a, i) => a + i.qty * i.price, 0);
  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <>
      <PageHeader
        title={order.id}
        description={`Placed ${new Date(order.createdAt).toLocaleString()} · ${order.customerName}`}
        actions={
          <>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" /> All orders
            </Link>
            <button className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">
              Advance status
            </button>
          </>
        }
      />
      <div className="p-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Status stepper */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold tracking-tight">Fulfillment</h2>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex items-center">
              {statusFlow.map((s, i) => {
                const done = order.status !== "returned" && i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s} className="flex-1 flex items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className="h-8 w-8 rounded-full grid place-items-center"
                        style={{
                          background: done
                            ? `color-mix(in oklch, var(--status-${s}) 20%, transparent)`
                            : "var(--muted)",
                          color: done ? `var(--status-${s})` : "var(--muted-foreground)",
                          outline: active ? `2px solid var(--status-${s})` : "none",
                          outlineOffset: "2px",
                        }}
                      >
                        {done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-[10px] text-center text-muted-foreground max-w-[80px]">
                        {statusLabels[s]}
                      </span>
                    </div>
                    {i < statusFlow.length - 1 && (
                      <div
                        className="h-0.5 flex-1"
                        style={{
                          background: done ? `var(--status-${s})` : "var(--border)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold tracking-tight">Items</h2>
              <span className="text-xs text-muted-foreground">
                {order.items.reduce((a, i) => a + i.qty, 0)} units
              </span>
            </div>
            <ul className="divide-y divide-border">
              {order.items.map((it) => (
                <li key={it.sku} className="flex items-center gap-4 px-5 py-3">
                  <div className="h-10 w-10 rounded-md bg-[var(--brand-soft)] grid place-items-center text-[var(--brand-dark)]">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">
                      {it.name}
                      {it.shade && <span className="text-muted-foreground"> · {it.shade}</span>}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{it.sku}</div>
                  </div>
                  <div className="text-sm text-muted-foreground w-12 text-right">× {it.qty}</div>
                  <div className="text-sm font-medium tabular-nums w-24 text-right">
                    {formatLKR(it.qty * it.price)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-border px-5 py-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-semibold tabular-nums">{formatLKR(total)}</span>
            </div>
          </div>

          {/* Audit log */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold tracking-tight">Status history</h2>
            </div>
            <ol className="p-5 space-y-3">
              {order.events.map((e, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div
                    className="mt-1 h-2 w-2 rounded-full shrink-0"
                    style={{ background: `var(--status-${e.to})` }}
                  />
                  <div className="flex-1">
                    <div>
                      <span className="font-medium">
                        {e.from ? `${statusLabels[e.from]} → ` : ""}
                        {statusLabels[e.to]}
                      </span>
                      <span className="text-muted-foreground"> · by {e.by}</span>
                    </div>
                    {e.note && <div className="text-xs text-muted-foreground">{e.note}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold tracking-tight">Customer</h3>
            <div>
              <div className="text-sm font-medium">{order.customerName}</div>
              <div className="text-xs text-muted-foreground">{order.customerId}</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              {order.whatsapp}
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
              <span>
                {order.address}
                <br />
                <span className="text-muted-foreground">{order.city}</span>
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold tracking-tight">Payment</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="uppercase font-medium">{order.method}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <PaymentBadge status={order.payment} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
              <Truck className="h-4 w-4" /> Courier
            </h3>
            {order.courier ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Partner</span>
                  <span className="font-medium">{order.courier}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tracking</span>
                  <span className="font-mono text-xs">{order.tracking}</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Not yet handed to courier.</p>
            )}
          </div>

          {order.chat.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-[var(--brand)]" /> WhatsApp thread
              </h3>
              <div className="mt-3 space-y-2 rounded-lg bg-[color:oklch(0.97_0.01_150)] p-3 max-h-72 overflow-y-auto">
                {order.chat.map((m, i) => (
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
            </div>
          )}
        </aside>
      </div>
    </>
  );
}