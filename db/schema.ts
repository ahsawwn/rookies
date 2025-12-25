import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, text, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique(),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    phone: text("phone").unique(),
    phoneVerified: boolean("phone_verified")
        .$defaultFn(() => false)
        .notNull(),
    image: text("image"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
    members: many(member),
    sessions: many(session),
    accounts: many(account),
    orders: many(order),
    carts: many(cart),
}));

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    activeOrganizationId: text("active_organization_id"),
});

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    ),
});

export const organization = pgTable("organization", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique(),
    logo: text("logo"),
    createdAt: timestamp("created_at").notNull(),
    metadata: text("metadata"),
});

export const organizationRelations = relations(organization, ({ many }) => ({
    members: many(member),
}));

export type Organization = typeof organization.$inferSelect;

export const role = pgEnum("role", ["member", "admin", "owner"]);

export type Role = (typeof role.enumValues)[number];

export const orderStatus = pgEnum("order_status", ["pending", "processing", "completed", "cancelled"]);

export type OrderStatus = (typeof orderStatus.enumValues)[number];

export const member = pgTable("member", {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    role: role("role").default("member").notNull(),
    createdAt: timestamp("created_at").notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
    organization: one(organization, {
        fields: [member.organizationId],
        references: [organization.id],
    }),
    user: one(user, {
        fields: [member.userId],
        references: [user.id],
    }),
}));

export type Member = typeof member.$inferSelect & {
    user: typeof user.$inferSelect;
};

export type User = typeof user.$inferSelect;

export const invitation = pgTable("invitation", {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
        .notNull()
        .references(() => organization.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role"),
    status: text("status").default("pending").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    inviterId: text("inviter_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const otp = pgTable("otp", {
    id: text("id").primaryKey(),
    phone: text("phone").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    verified: boolean("verified").default(false).notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const order = pgTable("order", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    orderNumber: text("order_number").notNull().unique(),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: orderStatus("status").default("pending").notNull(),
    paymentMethod: text("payment_method"),
    paymentStatus: text("payment_status").default("pending"),
    deliveryType: text("delivery_type"), // "delivery" or "pickup"
    deliveryAddress: jsonb("delivery_address"), // JSON for address details
    pickupBranchId: text("pickup_branch_id"),
    pickupVerificationCode: text("pickup_verification_code"), // 6-digit code for pickup validation
    pickupName: text("pickup_name"), // Name for pickup order
    pickupPhone: text("pickup_phone"), // Phone number for pickup order
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const orderItem = pgTable("order_item", {
    id: text("id").primaryKey(),
    orderId: text("order_id")
        .notNull()
        .references(() => order.id, { onDelete: "cascade" }),
    productId: text("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    priceAtTime: numeric("price_at_time", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const orderRelations = relations(order, ({ one, many }) => ({
    user: one(user, {
        fields: [order.userId],
        references: [user.id],
    }),
    items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
    order: one(order, {
        fields: [orderItem.orderId],
        references: [order.id],
    }),
    product: one(product, {
        fields: [orderItem.productId],
        references: [product.id],
    }),
}));

export type Order = typeof order.$inferSelect;

export const product = pgTable("product", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    shortDescription: text("short_description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
    image: text("image").notNull(),
    images: text("images").array(),
    category: text("category").notNull(), // classic, featured, seasonal
    calories: integer("calories"),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    stock: integer("stock").default(0).notNull(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export type Product = typeof product.$inferSelect;

export const adminRole = pgEnum("admin_role", ["super_admin", "admin", "manager"]);

export type AdminRole = (typeof adminRole.enumValues)[number];

export const admin = pgTable("admin", {
    id: text("id").primaryKey(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    name: text("name").notNull(),
    role: adminRole("role").default("admin").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastLogin: timestamp("last_login"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const adminSession = pgTable("admin_session", {
    id: text("id").primaryKey(),
    adminId: text("admin_id")
        .notNull()
        .references(() => admin.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export type Admin = typeof admin.$inferSelect;

export const adminRelations = relations(admin, ({ many }) => ({
    sessions: many(adminSession),
}));

export const adminSessionRelations = relations(adminSession, ({ one }) => ({
    admin: one(admin, {
        fields: [adminSession.adminId],
        references: [admin.id],
    }),
}));

export const saleStatus = pgEnum("sale_status", ["completed", "refunded", "cancelled"]);

export type SaleStatus = (typeof saleStatus.enumValues)[number];

export const sale = pgTable("sale", {
    id: text("id").primaryKey(),
    saleNumber: text("sale_number").unique().notNull(),
    adminId: text("admin_id")
        .notNull()
        .references(() => admin.id, { onDelete: "cascade" }),
    customerId: text("customer_id").references(() => user.id, { onDelete: "set null" }),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    discount: numeric("discount", { precision: 10, scale: 2 }).default("0").notNull(),
    tax: numeric("tax", { precision: 10, scale: 2 }).default("0").notNull(),
    paymentMethod: text("payment_method").notNull(),
    status: saleStatus("status").default("completed").notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const saleItem = pgTable("sale_item", {
    id: text("id").primaryKey(),
    saleId: text("sale_id")
        .notNull()
        .references(() => sale.id, { onDelete: "cascade" }),
    productId: text("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const stockMovementType = pgEnum("stock_movement_type", ["in", "out", "adjustment"]);

export type StockMovementType = (typeof stockMovementType.enumValues)[number];

export const stockMovement = pgTable("stock_movement", {
    id: text("id").primaryKey(),
    productId: text("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    type: stockMovementType("type").notNull(),
    quantity: integer("quantity").notNull(),
    reason: text("reason"),
    adminId: text("admin_id")
        .notNull()
        .references(() => admin.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const supplier = pgTable("supplier", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const purchaseOrderStatus = pgEnum("purchase_order_status", ["pending", "received", "cancelled"]);

export type PurchaseOrderStatus = (typeof purchaseOrderStatus.enumValues)[number];

export const purchaseOrder = pgTable("purchase_order", {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").unique().notNull(),
    supplierId: text("supplier_id")
        .notNull()
        .references(() => supplier.id, { onDelete: "cascade" }),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: purchaseOrderStatus("status").default("pending").notNull(),
    adminId: text("admin_id")
        .notNull()
        .references(() => admin.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const purchaseOrderItem = pgTable("purchase_order_item", {
    id: text("id").primaryKey(),
    purchaseOrderId: text("purchase_order_id")
        .notNull()
        .references(() => purchaseOrder.id, { onDelete: "cascade" }),
    productId: text("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    unitCost: numeric("unit_cost", { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const transactionType = pgEnum("transaction_type", ["income", "expense"]);

export type TransactionType = (typeof transactionType.enumValues)[number];

export const transaction = pgTable("transaction", {
    id: text("id").primaryKey(),
    type: transactionType("type").notNull(),
    category: text("category").notNull(),
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
    referenceId: text("reference_id"), // links to sale/purchase
    adminId: text("admin_id")
        .notNull()
        .references(() => admin.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const cart = pgTable("cart", {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    sessionId: text("session_id"), // For guest users
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const cartItem = pgTable("cart_item", {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
        .notNull()
        .references(() => cart.id, { onDelete: "cascade" }),
    productId: text("product_id")
        .notNull()
        .references(() => product.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const cartRelations = relations(cart, ({ one, many }) => ({
    user: one(user, {
        fields: [cart.userId],
        references: [user.id],
    }),
    items: many(cartItem),
}));

export const cartItemRelations = relations(cartItem, ({ one }) => ({
    cart: one(cart, {
        fields: [cartItem.cartId],
        references: [cart.id],
    }),
    product: one(product, {
        fields: [cartItem.productId],
        references: [product.id],
    }),
}));

export type Cart = typeof cart.$inferSelect;
export type CartItem = typeof cartItem.$inferSelect;

export const schema = {
    user,
    session,
    account,
    verification,
    organization,
    member,
    invitation,
    otp,
    order,
    product,
    admin,
    adminSession,
    sale,
    saleItem,
    stockMovement,
    supplier,
    purchaseOrder,
    purchaseOrderItem,
    transaction,
    cart,
    cartItem,
    orderItem,
    userRelations,
    sessionRelations,
    accountRelations,
    organizationRelations,
    memberRelations,
    orderRelations,
    orderItemRelations,
    adminRelations,
    adminSessionRelations,
    cartRelations,
    cartItemRelations,
};