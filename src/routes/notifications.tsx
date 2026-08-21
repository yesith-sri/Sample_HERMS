import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { notifications } from "@/lib/mock-data";
import { CheckCircle2, Clock, XCircle, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Glow OMS" },
      { name: "description", content: "Automated WhatsApp updates for confirmation, dispatch, out-for-delivery and delivered." },
      { property: "og:title", content: "Notifications — Glow OMS" },
      { property: "og:description", content: "Automated WhatsApp updates for confirmation, dispatch, out-for-delivery and delivered." },
    ],
  }),
  component: NotificationsPage,
});

const templates: Record<string, { title: string; body: string }> = {
  confirmation: { title: "Order confirmation", body: "Hi {{name}}! Your order {{id}} is confirmed. We'll message you when it ships." },
  dispatched: { title: "Order dispatched", body: "{{id}} handed over to {{courier}}. Track: {{tracking}}" },
  out_for_delivery: { title: "Out for delivery", body: "Your parcel is out for delivery today. Please keep {{amount}} ready if COD." },
  delivered: { title: "Delivered", body: "Delivered ✅ Enjoy your Glow! Tap to leave a review." },
  return: { title: "Return update", body: "We've received your return request for {{id}}. Refund processing in 2–3 days." },
};

const iconFor = (s: string) =>
  s === "sent" ? CheckCircle2 : s === "queued" ? Clock : XCircle;
const colorFor = (s: string) =>
  s === "sent"
    ? "var(--status-delivered)"
    : s === "queued"
      ? "var(--pay-pending)"
      : "var(--status-returned)";

function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Every automated WhatsApp update sent to customers."
      />
      <div className="p-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold tracking-tight">Recent sends</h2>
          </div>
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const Icon = iconFor(n.status);
              const c = colorFor(n.status);
              const tpl = templates[n.template];
              return (
                <div key={n.id} className="flex items-start gap-3 px-5 py-4">
                  <div
                    className="h-8 w-8 rounded-md grid place-items-center shrink-0"
                    style={{
                      background: `color-mix(in oklch, ${c} 14%, transparent)`,
                      color: c,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{tpl.title}</span>
                      <span className="text-xs text-muted-foreground">→ {n.customer}</span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {n.orderId} · {new Date(n.at).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-semibold" style={{ color: c }}>
                    {n.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[var(--brand)]" /> Templates
          </h3>
          <div className="mt-4 space-y-3">
            {Object.entries(templates).map(([k, t]) => (
              <div key={k} className="rounded-lg border border-border p-3">
                <div className="text-sm font-medium">{t.title}</div>
                <div
                  className="mt-2 rounded-lg px-3 py-2 text-xs"
                  style={{ background: "var(--chat-bubble)" }}
                >
                  {t.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}