import { z } from "zod";
import { raise } from "~/shared/exceptions.ts";
import { logger } from "~/shared/logging.ts";
import { OrderItemSchema, OrderSchema } from "~/entities/order.ts";

type Order = z.infer<typeof OrderSchema>;
type OrderItem = z.infer<typeof OrderItemSchema>;

export class OrderDao {
  constructor(private db: Deno.Kv, private userId: number) {}

  async upsertOrder(orderInput: Partial<Order>): Promise<Order> {
    let order: Order = OrderSchema.parse({
      ...orderInput,
      author_id: this.userId,
    });

    const oldOrder = await this.get(order.id);
    if (!oldOrder) {
      const res = await this.db.atomic()
        .set([this.orderKey(), order.id], order)
        .commit();

      return res.ok ? order : raise("failed to insert");
    }

    order = {
      ...oldOrder,
      ...order,
      updated_at: new Date(),
    };

    const res = await this.db.atomic()
      .set([this.orderKey(), order.id], order)
      .commit();

    return res.ok ? order : raise("failed to update");
  }

  async get(orderId: string) {
    const res = await this.db.get([this.orderKey(), orderId]);
    if (!res.value) return null;
    const order = OrderSchema.parse(res.value);

    const itemsIter = this.db.list(
      { prefix: [this.itemKey(orderId)] },
      { reverse: true },
    );

    const items: OrderItem[] = [];
    for await (const item of itemsIter) {
      const msg = OrderItemSchema.safeParse(item.value);
      if (!msg.success) {
        logger.error(msg.error);
        await this.db.delete(item.key);
        continue;
      }
      items.push(msg.data);
    }

    return {
      ...order,
      items,
    };
  }

  async delete(orderId: string) {
    const order = await this.get(orderId);
    if (order == null) return;

    const queryBuilder = this.db
      .atomic()
      .delete([this.orderKey(), order.id]);

    for (const item of order.items) {
      queryBuilder.delete([this.itemKey(order.id), item.id]);
    }

    await queryBuilder.commit();
  }

  async list() {
    const ordersIter = this.db.list(
      { prefix: [this.orderKey()] },
      { reverse: true },
    );

    const orders: Order[] = [];
    for await (const item of ordersIter) {
      const msg = OrderSchema.safeParse(item.value);
      if (!msg.success) {
        logger.error(msg.error);
        await this.db.delete(item.key);
        continue;
      }
      orders.push(msg.data);
    }

    return await Promise.all(orders.map((o) => this.get(o.id)));
  }

  private orderKey() {
    return `order:${this.userId}`;
  }

  private itemKey(orderId: string) {
    return `item:${this.userId}:${orderId}`;
  }
}
