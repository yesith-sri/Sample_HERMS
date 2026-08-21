import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { PaymentBadge } from "@/components/status-badge";
import { payments, formatLKR } from "@/lib/mock-data";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Glow OMS" },
      { name: "description", content: "Payment reconciliation, COD remittance tracking, and refunds." },
      { property: "og:title", content: "Payments — Glow OMS" },
      { property: "og:description", content: "Payment reconciliation, COD remittance tracking, and refunds." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const paid = payments.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const codPending = payments
    .filter((p) => p.method === "cod" && p.status === "pending")
    .reduce((a, p) => a + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "refunded").reduce((a, p) => a + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Payments"
        description="Reconcile courier remittance against expected COD collections."
      />
      <div className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "Collected", v: formatLKR(paid), tint: "--pay-paid" },
            { l: "COD to reconcile", v: formatLKR(codPending), tint: "--pay-pending" },
            { l: "Refunded", v: formatLKR(refunded), tint: "--pay-refunded" },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {k.l}
                </span>
                <span className="h-2 w-2 rounded-full" style={{ background: `var(${k.tint})` }} />
              </div>
              <div className="mt-3 text-2xl font-semibold tabular-nums">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[120px_120px_1fr_120px_140px_140px_130px] items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            <div>Payment</div>
            <div>Order</div>
            <div>Date</div>
            <div>Method</div>
            <div>Amount</div>
            <div>Courier remit</div>
            <div>Status</div>
          </div>
          <div className="divide-y divide-border">
            {payments.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[120px_120px_1fr_120px_140px_140px_130px] items-center gap-3 px-4 py-3 text-sm"
              >
                <div className="font-mono text-xs">{p.id}</div>
                <div className="font-mono text-xs text-muted-foreground">{p.orderId}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(p.date).toLocaleString()}
                </div>
                <div className="text-xs uppercase">{p.method}</div>
                <div className="tabular-nums font-medium">{formatLKR(p.amount)}</div>
                <div className="tabular-nums text-muted-foreground">
                  {p.courierRemit ? formatLKR(p.courierRemit) : "—"}
                </div>
                <div>
                  <PaymentBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}