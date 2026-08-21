import type { OrderStatus, PaymentStatus } from "@/lib/mock-data";
import { paymentLabels, statusLabels } from "@/lib/mock-data";

const statusVar: Record<OrderStatus, string> = {
  new: "--status-new",
  confirmed: "--status-confirmed",
  packed: "--status-packed",
  courier: "--status-courier",
  transit: "--status-transit",
  delivered: "--status-delivered",
  returned: "--status-returned",
};

const payVar: Record<PaymentStatus, string> = {
  pending: "--pay-pending",
  paid: "--pay-paid",
  partial: "--pay-pending",
  refunded: "--pay-refunded",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const v = statusVar[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        color: `var(${v})`,
        background: `color-mix(in oklch, var(${v}) 14%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(${v})` }} />
      {statusLabels[status]}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const v = payVar[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        color: `var(${v})`,
        background: `color-mix(in oklch, var(${v}) 14%, transparent)`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(${v})` }} />
      {paymentLabels[status]}
    </span>
  );
}