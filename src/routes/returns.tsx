import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { returns, formatLKR } from "@/lib/mock-data";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns — Glow OMS" },
      { name: "description", content: "Returns, refunds and exchanges with reason codes for cosmetics." },
      { property: "og:title", content: "Returns — Glow OMS" },
      { property: "og:description", content: "Returns, refunds and exchanges with reason codes for cosmetics." },
    ],
  }),
  component: ReturnsPage,
});

const reasonLabel = {
  shade_mismatch: "Shade mismatch",
  allergic: "Allergic reaction",
  damage: "Damage in transit",
  wrong_item: "Wrong item",
  other: "Other",
} as const;

const statusColor: Record<string, string> = {
  requested: "var(--status-new)",
  approved: "var(--status-confirmed)",
  received: "var(--status-packed)",
  refunded: "var(--pay-refunded)",
  rejected: "var(--status-returned)",
};

function ReturnsPage() {
  const byReason = Object.keys(reasonLabel).map((r) => ({
    key: r as keyof typeof reasonLabel,
    count: returns.filter((x) => x.reason === r).length,
  }));
  const total = returns.length;
  return (
    <>
      <PageHeader
        title="Returns & Refunds"
        description="Track return reasons to surface recurring product or quality issues."
      />
      <div className="p-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold tracking-tight">Return requests</h2>
          </div>
          <div className="divide-y divide-border">
            {returns.map((r) => (
              <div key={r.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{r.id}</span>
                  <span className="text-sm font-medium">{r.customer}</span>
                  <span className="text-xs text-muted-foreground">
                    · {r.orderId} · {new Date(r.date).toLocaleDateString()}
                  </span>
                  <span className="ml-auto tabular-nums text-sm font-medium">
                    {formatLKR(r.amount)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                    style={{
                      color: statusColor[r.status],
                      background: `color-mix(in oklch, ${statusColor[r.status]} 14%, transparent)`,
                    }}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="rounded-md bg-[var(--brand-soft)] px-2 py-0.5 text-xs text-[var(--brand-dark)] font-medium">
                    {reasonLabel[r.reason]}
                  </span>
                  {r.notes && <span className="text-muted-foreground text-xs">{r.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold tracking-tight">Reasons breakdown</h3>
          <div className="mt-4 space-y-3">
            {byReason.map((b) => (
              <div key={b.key}>
                <div className="flex items-center justify-between text-sm">
                  <span>{reasonLabel[b.key]}</span>
                  <span className="tabular-nums text-muted-foreground">{b.count}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--brand)]"
                    style={{ width: `${total ? (b.count / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}