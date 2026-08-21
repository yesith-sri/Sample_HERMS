export type OrderStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "courier"
  | "transit"
  | "delivered"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "partial" | "refunded";
export type PaymentMethod = "cod" | "transfer" | "card";

export interface OrderItem {
  sku: string;
  name: string;
  shade?: string;
  qty: number;
  price: number;
}

export interface OrderEvent {
  at: string;
  by: string;
  from?: OrderStatus;
  to: OrderStatus;
  note?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  whatsapp: string;
  address: string;
  city: string;
  createdAt: string;
  status: OrderStatus;
  payment: PaymentStatus;
  method: PaymentMethod;
  courier?: string;
  tracking?: string;
  items: OrderItem[];
  events: OrderEvent[];
  chat: { from: "customer" | "bot" | "agent"; text: string; at: string }[];
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  shade?: string;
  price: number;
  stock: number;
  threshold: number;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  city: string;
  orders: number;
  spend: number;
  aov: number;
  lastOrder: string;
  tags: string[];
  addresses: string[];
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  courierRemit?: number;
  date: string;
}

export interface Return {
  id: string;
  orderId: string;
  customer: string;
  reason: "shade_mismatch" | "allergic" | "damage" | "wrong_item" | "other";
  status: "requested" | "approved" | "received" | "refunded" | "rejected";
  amount: number;
  date: string;
  notes?: string;
}

export interface Promo {
  code: string;
  description: string;
  type: "percent" | "flat" | "shipping";
  value: number;
  usage: number;
  limit: number;
  active: boolean;
  expires: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "finance" | "packing" | "support";
  lastActive: string;
  status: "active" | "invited" | "suspended";
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface Notification {
  id: string;
  orderId: string;
  customer: string;
  channel: "whatsapp";
  template: "confirmation" | "dispatched" | "out_for_delivery" | "delivered" | "return";
  status: "sent" | "queued" | "failed";
  at: string;
}

export const products: Product[] = [
  { sku: "LIP-ROSE-04", name: "Velvet Matte Lipstick", category: "Lips", shade: "Rose 04", price: 1800, stock: 3, threshold: 10, updatedAt: "2h ago" },
  { sku: "LIP-CORAL-07", name: "Velvet Matte Lipstick", category: "Lips", shade: "Coral 07", price: 1800, stock: 42, threshold: 10, updatedAt: "5h ago" },
  { sku: "FDN-BEIGE-M", name: "Skin Silk Foundation", category: "Face", shade: "Beige M", price: 3200, stock: 18, threshold: 8, updatedAt: "1d ago" },
  { sku: "FDN-HONEY-D", name: "Skin Silk Foundation", category: "Face", shade: "Honey D", price: 3200, stock: 0, threshold: 8, updatedAt: "3d ago" },
  { sku: "MSK-HYDRA", name: "Hydra Sleep Mask", category: "Skincare", price: 2400, stock: 65, threshold: 15, updatedAt: "12h ago" },
  { sku: "SRM-VITC", name: "Vitamin C Serum", category: "Skincare", price: 4200, stock: 7, threshold: 12, updatedAt: "4h ago" },
  { sku: "BLS-PEACH", name: "Cheek Blush Duo", category: "Face", shade: "Peach", price: 2100, stock: 24, threshold: 10, updatedAt: "1d ago" },
  { sku: "MSC-BLACK", name: "Lash Volume Mascara", category: "Eyes", shade: "Jet Black", price: 1900, stock: 55, threshold: 15, updatedAt: "6h ago" },
  { sku: "EYE-SMOKE", name: "Smoke Eye Palette", category: "Eyes", price: 3800, stock: 11, threshold: 8, updatedAt: "2d ago" },
  { sku: "CLE-GENTLE", name: "Gentle Foaming Cleanser", category: "Skincare", price: 2200, stock: 33, threshold: 15, updatedAt: "1d ago" },
];

export const customers: Customer[] = [
  { id: "C-1001", name: "Amaya Perera", whatsapp: "+94 77 234 8821", city: "Colombo", orders: 7, spend: 24800, aov: 3542, lastOrder: "2d ago", tags: ["repeat", "VIP"], addresses: ["12 Marine Dr, Colombo 03"] },
  { id: "C-1002", name: "Nadeesha Silva", whatsapp: "+94 71 552 1109", city: "Kandy", orders: 3, spend: 9600, aov: 3200, lastOrder: "6d ago", tags: ["repeat"], addresses: ["Sanasa Ln, Peradeniya"] },
  { id: "C-1003", name: "Rashmi Fernando", whatsapp: "+94 76 998 4412", city: "Galle", orders: 1, spend: 1800, aov: 1800, lastOrder: "1d ago", tags: ["new"], addresses: ["44 Lighthouse St, Galle Fort"] },
  { id: "C-1004", name: "Ishara Kumar", whatsapp: "+94 70 811 3327", city: "Negombo", orders: 12, spend: 51400, aov: 4283, lastOrder: "today", tags: ["repeat", "VIP"], addresses: ["Beach Rd, Negombo"] },
  { id: "C-1005", name: "Tharushi Bandara", whatsapp: "+94 78 220 9987", city: "Colombo", orders: 2, spend: 5400, aov: 2700, lastOrder: "3d ago", tags: ["repeat"], addresses: ["Havelock Rd, Colombo 05"] },
  { id: "C-1006", name: "Sanduni Jayasuriya", whatsapp: "+94 77 660 2244", city: "Matara", orders: 5, spend: 17200, aov: 3440, lastOrder: "yesterday", tags: ["repeat"], addresses: ["Beach Ln, Matara"] },
  { id: "C-1007", name: "Dilhara Wickrama", whatsapp: "+94 71 445 7768", city: "Colombo", orders: 1, spend: 3200, aov: 3200, lastOrder: "today", tags: ["new"], addresses: ["Duplication Rd, Colombo 04"] },
];

const now = new Date();
const t = (h: number) => new Date(now.getTime() - h * 3600_000).toISOString();

export const orders: Order[] = [
  {
    id: "OMS-2418",
    customerId: "C-1004",
    customerName: "Ishara Kumar",
    whatsapp: "+94 70 811 3327",
    address: "Beach Rd, Negombo",
    city: "Negombo",
    createdAt: t(1),
    status: "new",
    payment: "pending",
    method: "cod",
    items: [
      { sku: "LIP-ROSE-04", name: "Velvet Matte Lipstick", shade: "Rose 04", qty: 2, price: 1800 },
      { sku: "MSC-BLACK", name: "Lash Volume Mascara", shade: "Jet Black", qty: 1, price: 1900 },
    ],
    events: [{ at: t(1), by: "WhatsApp Bot", to: "new", note: "Order captured via chat" }],
    chat: [
      { from: "customer", text: "Hi, I want to order the Rose 04 lipstick again", at: t(1.2) },
      { from: "bot", text: "Hi Ishara! Rose 04 is in stock. How many would you like?", at: t(1.15) },
      { from: "customer", text: "2 please, and one Jet Black mascara", at: t(1.1) },
      { from: "bot", text: "Total LKR 5,500 with COD. Ship to Beach Rd, Negombo?", at: t(1.05) },
      { from: "customer", text: "Yes confirm", at: t(1) },
    ],
  },
  {
    id: "OMS-2417",
    customerId: "C-1001",
    customerName: "Amaya Perera",
    whatsapp: "+94 77 234 8821",
    address: "12 Marine Dr, Colombo 03",
    city: "Colombo",
    createdAt: t(4),
    status: "confirmed",
    payment: "paid",
    method: "transfer",
    items: [
      { sku: "SRM-VITC", name: "Vitamin C Serum", qty: 1, price: 4200 },
      { sku: "MSK-HYDRA", name: "Hydra Sleep Mask", qty: 1, price: 2400 },
    ],
    events: [
      { at: t(4), by: "WhatsApp Bot", to: "new" },
      { at: t(3.5), by: "Nadia (Admin)", from: "new", to: "confirmed", note: "Payment verified" },
    ],
    chat: [],
  },
  {
    id: "OMS-2416",
    customerId: "C-1006",
    customerName: "Sanduni Jayasuriya",
    whatsapp: "+94 77 660 2244",
    address: "Beach Ln, Matara",
    city: "Matara",
    createdAt: t(9),
    status: "packed",
    payment: "pending",
    method: "cod",
    items: [
      { sku: "FDN-BEIGE-M", name: "Skin Silk Foundation", shade: "Beige M", qty: 1, price: 3200 },
      { sku: "BLS-PEACH", name: "Cheek Blush Duo", shade: "Peach", qty: 1, price: 2100 },
    ],
    events: [
      { at: t(9), by: "WhatsApp Bot", to: "new" },
      { at: t(8), by: "Nadia (Admin)", from: "new", to: "confirmed" },
      { at: t(6), by: "Ruwan (Packing)", from: "confirmed", to: "packed" },
    ],
    chat: [],
  },
  {
    id: "OMS-2415",
    customerId: "C-1002",
    customerName: "Nadeesha Silva",
    whatsapp: "+94 71 552 1109",
    address: "Sanasa Ln, Peradeniya",
    city: "Kandy",
    createdAt: t(26),
    status: "courier",
    payment: "pending",
    method: "cod",
    courier: "PromptDeliver",
    tracking: "PD-8827194",
    items: [{ sku: "EYE-SMOKE", name: "Smoke Eye Palette", qty: 1, price: 3800 }],
    events: [
      { at: t(26), by: "WhatsApp Bot", to: "new" },
      { at: t(24), by: "Nadia (Admin)", from: "new", to: "confirmed" },
      { at: t(20), by: "Ruwan (Packing)", from: "confirmed", to: "packed" },
      { at: t(6), by: "Courier API", from: "packed", to: "courier", note: "Handed over" },
    ],
    chat: [],
  },
  {
    id: "OMS-2414",
    customerId: "C-1005",
    customerName: "Tharushi Bandara",
    whatsapp: "+94 78 220 9987",
    address: "Havelock Rd, Colombo 05",
    city: "Colombo",
    createdAt: t(52),
    status: "transit",
    payment: "paid",
    method: "card",
    courier: "SwiftEx",
    tracking: "SE-4412008",
    items: [
      { sku: "CLE-GENTLE", name: "Gentle Foaming Cleanser", qty: 2, price: 2200 },
      { sku: "LIP-CORAL-07", name: "Velvet Matte Lipstick", shade: "Coral 07", qty: 1, price: 1800 },
    ],
    events: [
      { at: t(52), by: "WhatsApp Bot", to: "new" },
      { at: t(48), by: "Nadia (Admin)", from: "new", to: "confirmed" },
      { at: t(40), by: "Ruwan (Packing)", from: "confirmed", to: "packed" },
      { at: t(30), by: "Courier API", from: "packed", to: "courier" },
      { at: t(6), by: "Courier Webhook", from: "courier", to: "transit" },
    ],
    chat: [],
  },
  {
    id: "OMS-2413",
    customerId: "C-1003",
    customerName: "Rashmi Fernando",
    whatsapp: "+94 76 998 4412",
    address: "44 Lighthouse St, Galle Fort",
    city: "Galle",
    createdAt: t(80),
    status: "delivered",
    payment: "paid",
    method: "cod",
    courier: "PromptDeliver",
    tracking: "PD-8827001",
    items: [{ sku: "LIP-ROSE-04", name: "Velvet Matte Lipstick", shade: "Rose 04", qty: 1, price: 1800 }],
    events: [
      { at: t(80), by: "WhatsApp Bot", to: "new" },
      { at: t(76), by: "Nadia (Admin)", from: "new", to: "confirmed" },
      { at: t(70), by: "Ruwan (Packing)", from: "confirmed", to: "packed" },
      { at: t(60), by: "Courier API", from: "packed", to: "courier" },
      { at: t(40), by: "Courier Webhook", from: "courier", to: "transit" },
      { at: t(10), by: "Courier Webhook", from: "transit", to: "delivered" },
    ],
    chat: [],
  },
  {
    id: "OMS-2412",
    customerId: "C-1007",
    customerName: "Dilhara Wickrama",
    whatsapp: "+94 71 445 7768",
    address: "Duplication Rd, Colombo 04",
    city: "Colombo",
    createdAt: t(120),
    status: "returned",
    payment: "refunded",
    method: "card",
    courier: "SwiftEx",
    tracking: "SE-4411870",
    items: [{ sku: "FDN-HONEY-D", name: "Skin Silk Foundation", shade: "Honey D", qty: 1, price: 3200 }],
    events: [
      { at: t(120), by: "WhatsApp Bot", to: "new" },
      { at: t(115), by: "Nadia (Admin)", from: "new", to: "confirmed" },
      { at: t(100), by: "Ruwan (Packing)", from: "confirmed", to: "packed" },
      { at: t(90), by: "Courier API", from: "packed", to: "courier" },
      { at: t(60), by: "Courier Webhook", from: "courier", to: "delivered" },
      { at: t(20), by: "Sadun (Support)", from: "delivered", to: "returned", note: "Shade mismatch" },
    ],
    chat: [],
  },
];

export const payments: Payment[] = [
  { id: "P-9021", orderId: "OMS-2417", amount: 6600, method: "transfer", status: "paid", date: t(3.5) },
  { id: "P-9020", orderId: "OMS-2414", amount: 6200, method: "card", status: "paid", date: t(50) },
  { id: "P-9019", orderId: "OMS-2413", amount: 1800, method: "cod", status: "paid", courierRemit: 1800, date: t(9) },
  { id: "P-9018", orderId: "OMS-2415", amount: 3800, method: "cod", status: "pending", date: t(26) },
  { id: "P-9017", orderId: "OMS-2416", amount: 5300, method: "cod", status: "pending", date: t(9) },
  { id: "P-9016", orderId: "OMS-2418", amount: 5500, method: "cod", status: "pending", date: t(1) },
  { id: "P-9015", orderId: "OMS-2412", amount: 3200, method: "card", status: "refunded", date: t(18) },
];

export const returns: Return[] = [
  { id: "R-3001", orderId: "OMS-2412", customer: "Dilhara Wickrama", reason: "shade_mismatch", status: "refunded", amount: 3200, date: t(20), notes: "Honey D too dark, refunded to card" },
  { id: "R-3000", orderId: "OMS-2409", customer: "Chethana Ranasinghe", reason: "allergic", status: "approved", amount: 4200, date: t(48), notes: "Vitamin C serum caused irritation" },
  { id: "R-2999", orderId: "OMS-2405", customer: "Kavindi Silva", reason: "damage", status: "received", amount: 2100, date: t(72), notes: "Blush compact cracked in transit" },
  { id: "R-2998", orderId: "OMS-2401", customer: "Menuki Perera", reason: "wrong_item", status: "requested", amount: 1900, date: t(120), notes: "Received brown mascara instead of black" },
];

export const promos: Promo[] = [
  { code: "GLOW20", description: "20% off first order", type: "percent", value: 20, usage: 142, limit: 500, active: true, expires: "31 Aug 2026" },
  { code: "FREESHIP", description: "Free shipping over LKR 5,000", type: "shipping", value: 0, usage: 88, limit: 0, active: true, expires: "—" },
  { code: "LIPS500", description: "LKR 500 off any lipstick", type: "flat", value: 500, usage: 34, limit: 200, active: true, expires: "15 Aug 2026" },
  { code: "VIP15", description: "VIP customers, 15% off", type: "percent", value: 15, usage: 21, limit: 100, active: false, expires: "30 Jun 2026" },
];

export const staff: StaffMember[] = [
  { id: "U-01", name: "Nadia Karunaratne", email: "nadia@brand.lk", role: "admin", lastActive: "now", status: "active" },
  { id: "U-02", name: "Ruwan Perera", email: "ruwan@brand.lk", role: "packing", lastActive: "12m ago", status: "active" },
  { id: "U-03", name: "Sadun Fernando", email: "sadun@brand.lk", role: "support", lastActive: "1h ago", status: "active" },
  { id: "U-04", name: "Priya Silva", email: "priya@brand.lk", role: "finance", lastActive: "3h ago", status: "active" },
  { id: "U-05", name: "Hasitha Jay", email: "hasitha@brand.lk", role: "packing", lastActive: "—", status: "invited" },
];

export const audit: AuditLog[] = [
  { id: "A-501", actor: "Nadia (Admin)", action: "Cancelled order", target: "OMS-2410", at: t(2) },
  { id: "A-500", actor: "Ruwan (Packing)", action: "Marked packed", target: "OMS-2416", at: t(6) },
  { id: "A-499", actor: "Priya (Finance)", action: "Reconciled payment", target: "P-9019", at: t(9) },
  { id: "A-498", actor: "Sadun (Support)", action: "Approved return", target: "R-3000", at: t(48) },
  { id: "A-497", actor: "Nadia (Admin)", action: "Updated stock", target: "LIP-ROSE-04", at: t(12) },
];

export const notifications: Notification[] = [
  { id: "N-7701", orderId: "OMS-2418", customer: "Ishara Kumar", channel: "whatsapp", template: "confirmation", status: "sent", at: t(1) },
  { id: "N-7700", orderId: "OMS-2416", customer: "Sanduni Jayasuriya", channel: "whatsapp", template: "dispatched", status: "sent", at: t(6) },
  { id: "N-7699", orderId: "OMS-2414", customer: "Tharushi Bandara", channel: "whatsapp", template: "out_for_delivery", status: "sent", at: t(6) },
  { id: "N-7698", orderId: "OMS-2413", customer: "Rashmi Fernando", channel: "whatsapp", template: "delivered", status: "sent", at: t(10) },
  { id: "N-7697", orderId: "OMS-2412", customer: "Dilhara Wickrama", channel: "whatsapp", template: "return", status: "sent", at: t(20) },
  { id: "N-7696", orderId: "OMS-2411", customer: "Menuki Perera", channel: "whatsapp", template: "confirmation", status: "failed", at: t(28) },
];

export const statusLabels: Record<OrderStatus, string> = {
  new: "New",
  confirmed: "Confirmed",
  packed: "Packed",
  courier: "Handed to Courier",
  transit: "In Transit",
  delivered: "Delivered",
  returned: "Returned / Failed",
};

export const statusFlow: OrderStatus[] = [
  "new",
  "confirmed",
  "packed",
  "courier",
  "transit",
  "delivered",
];

export const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  partial: "Partially Paid",
  refunded: "Refunded",
};

export function formatLKR(n: number) {
  return "LKR " + n.toLocaleString("en-LK");
}