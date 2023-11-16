import { TaskSchema } from "./task.ts";
import * as assert from "$std/assert/mod.ts";
import { raise } from "~/shared/exceptions.ts";

Deno.test("Task Entity", async (t) => {
  const input = { title: "Hello" };

  await t.step("should require at list a title", () => {
    const result = TaskSchema.safeParse(input);

    assert.equal(result.success, true);
    if (result.success) {
      const task = result.data;

      assert.assertExists(task.id);
      assert.equal(task.notes, "");
      assert.equal(task.description, "");
      assert.equal(task.title, input.title);
      assert.equal(task.updated_at, task.created_at);
    }
  });

  await t.step("should fail if no title is passed", () => {
    const result = TaskSchema.safeParse({});

    if (result.success) return raise("should now succed");

    const error = result.error.errors.at(0) ?? raise("no error");
    assert.assert(error.path.includes("title"));
    assert.equal(error.code, "type_invalid");
  });
});
