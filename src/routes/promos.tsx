import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { promos } from "@/lib/mock-data";
import { Plus, Tag } from "lucide-react";

export const Route = createFileRoute("/promos")({
  head: () => ({
    meta: [
      { title: "Promo codes — Glow OMS" },
      { name: "description", content: "Discount and promo codes validated inside the WhatsApp bot flow." },
      { property: "og:title", content: "Promo codes — Glow OMS" },
      { property: "og:description", content: "Discount and promo codes validated inside the WhatsApp bot flow." },
    ],
  }),
  component: PromosPage,
});

function PromosPage() {
  return (
    <>
      <PageHeader
        title="Promo codes"
        description="Validated inline by the bot when a customer types a code."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">
            <Plus className="h-4 w-4" /> New code
          </button>
        }
      />
      <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promos.map((p) => (
          <div key={p.code} className="rounded-xl border border-border bg-card overflow-hidden">
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: p.active ? "var(--brand-soft)" : "var(--muted)" }}
            >
              <Tag
                className="h-5 w-5"
                style={{
                  color: p.active ? "var(--brand-dark)" : "var(--muted-foreground)",
                }}
              />
              <div className="font-mono font-semibold tracking-wider">{p.code}</div>
              <span
                className={`ml-auto text-[10px] uppercase font-medium rounded-full px-2 py-0.5 ${
                  p.active
                    ? "bg-white text-[var(--brand-dark)]"
                    : "bg-card text-muted-foreground"
                }`}
              >
                {p.active ? "Active" : "Paused"}
              </span>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm">{p.description}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider text-[10px]">
                    Value
                  </div>
                  <div className="font-medium">
                    {p.type === "percent" && `${p.value}%`}
                    {p.type === "flat" && `LKR ${p.value}`}
                    {p.type === "shipping" && "Free shipping"}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground uppercase tracking-wider text-[10px]">
                    Expires
                  </div>
                  <div className="font-medium">{p.expires}</div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Usage</span>
                  <span className="tabular-nums">
                    {p.usage}
                    {p.limit ? ` / ${p.limit}` : ""}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--brand)]"
                    style={{
                      width: `${p.limit ? Math.min(100, (p.usage / p.limit) * 100) : 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}