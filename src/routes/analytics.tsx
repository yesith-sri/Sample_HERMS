import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { orders, products, returns, formatLKR } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Glow OMS" },
      { name: "description", content: "Sales, best-selling SKUs, courier performance and return rate reporting." },
      { property: "og:title", content: "Analytics — Glow OMS" },
      { property: "og:description", content: "Sales, best-selling SKUs, courier performance and return rate reporting." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const revenue = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty * i.price, 0), 0);
  const returnRate = ((returns.length / orders.length) * 100).toFixed(1);
  const avgOrder = Math.round(revenue / orders.length);

  const skuSales: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const o of orders) {
    for (const i of o.items) {
      const k = i.sku;
      const label = i.name + (i.shade ? ` · ${i.shade}` : "");
      skuSales[k] = skuSales[k] || { name: label, units: 0, revenue: 0 };
      skuSales[k].units += i.qty;
      skuSales[k].revenue += i.qty * i.price;
    }
  }
  const top = Object.entries(skuSales)
    .map(([sku, v]) => ({ sku, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
  const maxRev = Math.max(1, ...top.map((t) => t.revenue));

  const daily = [12, 18, 15, 22, 26, 19, 31];
  const maxDaily = Math.max(...daily);

  const courierPerf = [
    { name: "PromptDeliver", orders: 42, success: 94, avgHours: 22 },
    { name: "SwiftEx", orders: 31, success: 88, avgHours: 30 },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Management reporting — separate from day-to-day operations."
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { l: "Revenue (period)", v: formatLKR(revenue) },
            { l: "Orders", v: orders.length.toString() },
            { l: "Avg. order value", v: formatLKR(avgOrder) },
            { l: "Return rate", v: `${returnRate}%` },
          ].map((k) => (
            <div key={k.l} className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.l}</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{k.v}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Daily orders — last 7 days</h3>
            <div className="mt-6 flex items-end gap-3 h-40">
              {daily.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-md bg-[var(--brand)]"
                      style={{ height: `${(d / maxDaily) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Inventory health</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="SKUs tracked" value={products.length.toString()} />
              <Row
                label="Low stock"
                value={products.filter((p) => p.stock > 0 && p.stock <= p.threshold).length.toString()}
              />
              <Row
                label="Out of stock"
                value={products.filter((p) => p.stock === 0).length.toString()}
                warn
              />
              <Row
                label="Inventory value"
                value={formatLKR(products.reduce((a, p) => a + p.stock * p.price, 0))}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Best-selling SKUs</h3>
            <div className="mt-4 space-y-3">
              {top.map((t) => (
                <div key={t.sku}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{t.name}</span>
                    <span className="tabular-nums text-muted-foreground text-xs">
                      {t.units}u · {formatLKR(t.revenue)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: `${(t.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold tracking-tight">Courier performance</h3>
            <div className="mt-4 space-y-4">
              {courierPerf.map((c) => (
                <div key={c.name} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.orders} orders</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground">Success</div>
                      <div className="text-lg font-semibold tabular-nums">{c.success}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground">Avg. delivery</div>
                      <div className="text-lg font-semibold tabular-nums">{c.avgHours}h</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`tabular-nums font-medium ${warn ? "text-[color:var(--status-returned)]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}