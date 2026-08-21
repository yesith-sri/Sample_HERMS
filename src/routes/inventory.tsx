import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Package, Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { products, formatLKR } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Glow OMS" },
      { name: "description", content: "Real-time stock levels, low-stock alerts, and adjustments per SKU." },
      { property: "og:title", content: "Inventory — Glow OMS" },
      { property: "og:description", content: "Real-time stock levels, low-stock alerts, and adjustments per SKU." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  const [q, setQ] = useState("");
  const list = products.filter((p) =>
    `${p.sku} ${p.name} ${p.shade ?? ""} ${p.category}`.toLowerCase().includes(q.toLowerCase()),
  );
  const totalUnits = products.reduce((a, p) => a + p.stock, 0);
  const inventoryValue = products.reduce((a, p) => a + p.stock * p.price, 0);
  const low = products.filter((p) => p.stock <= p.threshold).length;
  const out = products.filter((p) => p.stock === 0).length;

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Stock deducts in real time as the bot confirms orders."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">
            <Plus className="h-4 w-4" /> Add product
          </button>
        }
      />
      <div className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "SKUs", value: products.length.toString() },
            { label: "Units in stock", value: totalUnits.toString() },
            { label: "Inventory value", value: formatLKR(inventoryValue) },
            { label: "Low / Out", value: `${low} / ${out}` },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-2 text-xl font-semibold tabular-nums">{k.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm w-72 max-w-full">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search SKU, product, shade…"
            className="bg-transparent outline-none flex-1 placeholder:text-muted-foreground"
          />
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-[1fr_120px_120px_140px_160px_120px] items-center gap-3 border-b border-border bg-secondary/60 px-4 py-2.5 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock / Threshold</div>
            <div>Status</div>
            <div>Updated</div>
          </div>
          <div className="divide-y divide-border">
            {list.map((p) => {
              const ratio = p.threshold ? p.stock / (p.threshold * 3) : 1;
              const level = p.stock === 0 ? "out" : p.stock <= p.threshold ? "low" : "ok";
              const color =
                level === "out"
                  ? "var(--status-returned)"
                  : level === "low"
                    ? "var(--pay-pending)"
                    : "var(--status-delivered)";
              return (
                <div
                  key={p.sku}
                  className="grid grid-cols-[1fr_120px_120px_140px_160px_120px] items-center gap-3 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-[var(--brand-soft)] grid place-items-center text-[var(--brand-dark)]">
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {p.name}
                        {p.shade && (
                          <span className="text-muted-foreground"> · {p.shade}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">{p.sku}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                  <div className="tabular-nums">{formatLKR(p.price)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium tabular-nums w-8 text-right">{p.stock}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, ratio * 100)}%`, background: color }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      threshold {p.threshold}
                    </div>
                  </div>
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        color,
                        background: `color-mix(in oklch, ${color} 14%, transparent)`,
                      }}
                    >
                      {level === "ok" && "In stock"}
                      {level === "low" && (
                        <>
                          <AlertTriangle className="h-3 w-3" /> Low
                        </>
                      )}
                      {level === "out" && "Out of stock"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{p.updatedAt}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}