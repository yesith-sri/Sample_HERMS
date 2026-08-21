import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { customers, formatLKR } from "@/lib/mock-data";

export const Route = createFileRoute("/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Glow OMS" },
      { name: "description", content: "Customer profiles keyed by WhatsApp number, order history and lifetime value." },
      { property: "og:title", content: "Customers — Glow OMS" },
      { property: "og:description", content: "Customer profiles keyed by WhatsApp number, order history and lifetime value." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  return (
    <>
      <PageHeader
        title="Customers"
        description="Profiles built automatically from each WhatsApp number."
      />
      <div className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { l: "Customers", v: customers.length.toString() },
            { l: "Repeat", v: customers.filter((c) => c.tags.includes("repeat")).length.toString() },
            { l: "VIP", v: customers.filter((c) => c.tags.includes("VIP")).length.toString() },
            {
              l: "Avg. AOV",
              v: formatLKR(
                Math.round(customers.reduce((a, c) => a + c.aov, 0) / customers.length),
              ),
            },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="mt-2 text-xl font-semibold tabular-nums">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-[var(--brand-soft)] grid place-items-center text-sm font-semibold text-[var(--brand-dark)]">
                  {c.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.whatsapp}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${
                        t === "VIP"
                          ? "bg-[color:var(--pay-pending)]/15 text-[color:var(--pay-pending)]"
                          : t === "new"
                            ? "bg-[color:var(--status-new)]/15 text-[color:var(--status-new)]"
                            : "bg-[var(--brand-soft)] text-[var(--brand-dark)]"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Metric label="Orders" value={c.orders.toString()} />
                <Metric label="Spend" value={formatLKR(c.spend)} />
                <Metric label="AOV" value={formatLKR(c.aov)} />
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Last order {c.lastOrder} · {c.city}
              </div>
              <div className="mt-3 rounded-md bg-muted/60 px-3 py-2 text-xs">
                📍 {c.addresses[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-secondary/60 px-2 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
    </div>
  );
}