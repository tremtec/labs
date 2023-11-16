import { Task, TaskSchema } from "~/entities/task.ts";
import { raise } from "~/shared/exceptions.ts";
import { kv } from "~/repositories/db.ts";
import { logger } from "~/shared/logging.ts";

export class TaskDao {
  constructor(private db: Deno.Kv, private userId: string) {}

  async add(taskInput: Partial<Task>): Promise<Task> {
    const task = TaskSchema.parse(taskInput);
    const res = await this.db.atomic()
      .set([this.prefixKey, task.id], task)
      .set([this.prefixSortedKey, task.updated_at.getTime()], task)
      .commit();
    return res.ok ? task : raise("failed to insert");
  }

  async upsert(taskInput: Partial<Task>): Promise<Task> {
    const inputTask = TaskSchema
      .partial()
      .required({ id: true })
      .parse(taskInput);

    const oldTask = await this.get(inputTask.id);
    if (!oldTask) return this.add(taskInput);

    const task = {
      ...oldTask,
      ...taskInput,
      updated_at: new Date(),
    };

    const res = await this.db.atomic()
      .delete([this.prefixSortedKey, oldTask.updated_at.getTime()])
      .set([this.prefixKey, task.id], task)
      .set([this.prefixSortedKey, task.updated_at.getTime()], task)
      .commit();

    return res.ok ? task : raise("failed to insert");
  }

  async get(taskId: string): Promise<Task | null> {
    const res = await this.db.get([this.prefixKey, taskId]);
    if (!res.value) return null;
    return TaskSchema.parse(res.value);
  }

  async delete(taskId: string) {
    const task = await this.get(taskId);
    if (task == null) return;

    await this.db.atomic()
      .delete([this.prefixKey, task.id])
      .delete([this.prefixSortedKey, task.updated_at.getTime()])
      .commit();
  }

  async list({ limit = 10, cursor = "" } = {}): Promise<Task[]> {
    const messagesIter = this.db.list(
      { prefix: [this.prefixSortedKey] },
      { reverse: true, limit, cursor },
    );

    const messages: Task[] = [];
    for await (const item of messagesIter) {
      const msg = TaskSchema.safeParse(item.value);
      if (!msg.success) {
        logger.error(msg.error);
        await kv.delete(item.key);
        continue;
      }
      messages.push(msg.data);
    }

    return messages;
  }

  private get prefixKey() {
    return `${this.userId}:task`;
  }
  private get prefixSortedKey() {
    return `${this.userId}:task:sorted`;
  }
}
