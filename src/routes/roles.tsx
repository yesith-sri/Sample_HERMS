import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { staff, audit } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Audit — Glow OMS" },
      { name: "description", content: "Team access, permissions and audit log of order edits and cancellations." },
      { property: "og:title", content: "Roles & Audit — Glow OMS" },
      { property: "og:description", content: "Team access, permissions and audit log of order edits and cancellations." },
    ],
  }),
  component: RolesPage,
});

const permMatrix: { area: string; admin: boolean; finance: boolean; packing: boolean; support: boolean }[] = [
  { area: "View orders", admin: true, finance: true, packing: true, support: true },
  { area: "Edit / cancel orders", admin: true, finance: false, packing: false, support: true },
  { area: "Mark packed / dispatch", admin: true, finance: false, packing: true, support: false },
  { area: "Reconcile payments", admin: true, finance: true, packing: false, support: false },
  { area: "Issue refunds", admin: true, finance: true, packing: false, support: false },
  { area: "Manage inventory", admin: true, finance: false, packing: true, support: false },
  { area: "Manage staff & roles", admin: true, finance: false, packing: false, support: false },
];

const roleColor: Record<string, string> = {
  admin: "var(--status-returned)",
  finance: "var(--pay-pending)",
  packing: "var(--status-packed)",
  support: "var(--status-confirmed)",
};

function RolesPage() {
  return (
    <>
      <PageHeader
        title="Roles & Audit"
        description="Separate access for packing, finance, support and admin — with a full audit trail."
        actions={
          <button className="inline-flex items-center gap-2 rounded-md bg-[var(--brand)] text-primary-foreground px-3 py-2 text-sm font-medium hover:opacity-90">
            <UserPlus className="h-4 w-4" /> Invite member
          </button>
        }
      />
      <div className="p-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold tracking-tight">Team members</h3>
          </div>
          <div className="divide-y divide-border">
            {staff.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <div className="h-9 w-9 rounded-full bg-[var(--brand-soft)] grid place-items-center text-xs font-semibold text-[var(--brand-dark)]">
                  {m.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{m.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.email}</div>
                </div>
                <span
                  className="text-[10px] uppercase rounded-full px-2 py-0.5 font-medium"
                  style={{
                    color: roleColor[m.role],
                    background: `color-mix(in oklch, ${roleColor[m.role]} 14%, transparent)`,
                  }}
                >
                  {m.role}
                </span>
                <span className="text-xs text-muted-foreground w-20 text-right">
                  {m.status === "invited" ? "Invited" : m.lastActive}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold tracking-tight">Permissions</h3>
          </div>
          <div>
            <div className="grid grid-cols-[1fr_repeat(4,72px)] items-center gap-2 border-b border-border bg-secondary/60 px-5 py-2.5 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              <div>Area</div>
              <div className="text-center">Admin</div>
              <div className="text-center">Finance</div>
              <div className="text-center">Packing</div>
              <div className="text-center">Support</div>
            </div>
            <ul className="divide-y divide-border">
              {permMatrix.map((p) => (
                <li
                  key={p.area}
                  className="grid grid-cols-[1fr_repeat(4,72px)] items-center gap-2 px-5 py-2.5 text-sm"
                >
                  <span>{p.area}</span>
                  {[p.admin, p.finance, p.packing, p.support].map((v, i) => (
                    <div key={i} className="text-center">
                      {v ? (
                        <span className="inline-block h-2 w-2 rounded-full bg-[var(--brand)]" />
                      ) : (
                        <span className="inline-block h-2 w-2 rounded-full bg-muted" />
                      )}
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="font-semibold tracking-tight">Audit log</h3>
          </div>
          <ul className="divide-y divide-border">
            {audit.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground w-16">{a.id}</span>
                <span className="font-medium">{a.actor}</span>
                <span className="text-muted-foreground">{a.action}</span>
                <span className="font-mono text-xs">{a.target}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(a.at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}